// import { HandleCommand } from '../lib/commands';
import * as conf from '../config';
import * as commands2 from '../lib/commands2';
import * as utils from '../lib/utils';
import { logCustom, logDebug } from './logging/events/custom';
import { isIgnoredChannel, isIgnoredUser, parseMessageContent } from './logging/main';
import { isModuleEnabled } from '../lib/eventHandler/routing';

const TEMPORARY_SLASH_COMMANDS_MODULE_LIMITER = 'ccc';
const SLASH_COMMANDS_LIMIT = 10;

type SlashCommandRegistry = {
  config: discord.interactions.commands.ICommandConfig<any>;
  extras: SlashExtras;
}
type SlashCommandGroupRegistry = {
  config: discord.interactions.commands.ICommandConfig<any>;
  extras?: SlashExtras;
}
export const registeredSlashCommands: SlashCommandRegistry[] = [];
export const registeredSlashCommandGroups: SlashCommandGroupRegistry[] = [];

interface ApiError extends discord.ApiError {
  messageExtended: string | undefined;
}

type SlashPermissionsCheck = {
  overrideableInfo: string;
  level: number;
  owner?: boolean;
  globalAdmin?: boolean;
}

type SlashExtras = {
  permissions?: SlashPermissionsCheck;
  staticAck?: boolean;
  module: string;
  parent?: string;
};

function getTopLevelSlashCommands() {
  return [...registeredSlashCommands.filter((v) => !v.extras.parent), ...registeredSlashCommandGroups.filter((v) => !v.extras.parent)];
}
function getFullCommandName(name: string, parent?: string) {
  if (!parent) {
    return name;
  }
  const parentF = registeredSlashCommandGroups.find((v) => v.config.name === parent);
  if (!parentF || !parentF.extras) {
    return `${parentF.config.name} ${name}`;
  }
  return getFullCommandName(`${parentF.config.name} ${name}`, parentF.extras.parent);
}
async function executeSlash(sconf: discord.interactions.commands.ICommandConfig<any>, extras: SlashExtras, callback: discord.interactions.commands.HandlerFunction<any>, interaction: discord.interactions.commands.SlashCommandInteraction, ...args: any) {
  const fullCmdName = getFullCommandName(sconf.name, extras.parent);
  if (typeof conf.config !== 'object' || conf.config === null || typeof conf.config === 'undefined') {
    const ret = await conf.InitializeConfig();
    if (!ret) {
      return;
    }
  }
  console.log(`Executing slash command [${fullCmdName}]`);
  if (extras.module) {
    if (!isModuleEnabled(extras.module)) {
      try {
        await interaction.acknowledge(false);
      } catch (_) {}
      await interaction.respondEphemeral('**This command is disabled**');
      return;
    }
  }
  if (typeof cooldowns[interaction.member.user.id] === 'number') {
    const diff = Date.now() - cooldowns[interaction.member.user.id];
    // global cmd cooldown!
    if (diff < 750) {
      return;
    }
  }
  if (interaction.member.user.bot && !utils.isCommandsAuthorized(interaction.member)) {
    return;
  }
  if (!utils.isCommandsAuthorized(interaction.member)) {
    await interaction.acknowledge(false);
    await utils.reportBlockedAction(interaction.member, `slash command execution: \`${fullCmdName}\``);
    return;
  }
  if (extras.permissions) {
    const perms = await commands2.checkSlashPerms(interaction, extras.permissions.overrideableInfo, extras.permissions.level, extras.permissions.owner, extras.permissions.globalAdmin);
    if (!perms.access) {
      try {
        await interaction.acknowledge(false);
      } catch (_) {}
      if (perms.errors.length > 0) {
        await interaction.respondEphemeral(`**You can't use that command!**\n__You must meet all of following criteria:__\n\n${perms.errors.join('\n')}`);
      }
      return;
    }
  }
  try {
    if (typeof extras.staticAck === 'boolean') {
      try {
        await interaction.acknowledge(extras.staticAck);
      } catch (_) {}
    }
    // @ts-ignore
    await callback(interaction, ...args);
  } catch (_e) {
    try {
      await interaction.acknowledge(false);
    } catch (_) {}
    utils.logError(_e);

    if (_e.messageExtended && typeof _e.messageExtended === 'string') {
      try {
        const emsg: any = JSON.parse(_e.messageExtended).message;
        if (emsg && emsg.toLowerCase() === 'missing permissions') {
          await interaction.respondEphemeral(`**There has been an error executing this command**\n\n__${emsg}__`);
          return;
        }
      } catch (e) {}
    }
    await interaction.respondEphemeral('**There has been an error executing this command**\n\nThis has been logged and the bot developer will look into it shortly.');
    logDebug(
      'BOT_ERROR',
      new Map<string, any>([
        [
          'ERROR',
          `Slash Command Error on '${fullCmdName}': \n${_e.stack}`,
        ],
      ]),
    );
  }
  cooldowns[interaction.member.user.id] = Date.now();

  if (!isIgnoredChannel(interaction.channelId) && !isIgnoredUser(interaction.member)) {
    let argsString = '';
    if (sconf.options && args.length > 0) {
      for (const i in args) {
        for (const key in args[i]) {
          const val = args[i][key];
          let valOutput = '';
          if (typeof val === 'string') {
            valOutput = val;
          } else if (typeof val === 'boolean') {
            valOutput = val === true ? 'true' : 'false';
          } else if (typeof val === 'number') {
            valOutput = `${val}`;
          } else if (val instanceof discord.GuildMember) {
            valOutput = val.user.getTag();
          } else if (val instanceof discord.Role) {
            valOutput = val.name;
          } else if (val instanceof discord.GuildChannel) {
            valOutput = val.name;
          } else {
            console.warn(`Argument ${key} typing not found??`);
          }
          if (valOutput !== '') {
            if (argsString !== '') {
              argsString += ' , ';
            }
            argsString += `\`${key}\`:\`${utils.escapeString(valOutput, true)}\``;
          }
        }
      }
    }
    if (argsString !== '') {
      argsString = ` with arguments ${argsString}`;
    }
    logCustom(
      'COMMANDS',
      'SLASH_COMMAND_USED',
      new Map<string, any>([
        ['_COMMAND_NAME_', fullCmdName],
        ['_AUTHOR_', interaction.member.user],
        ['_USER_', interaction.member.user],
        ['_USER_ID_', interaction.member.user.id],
        ['_MEMBER_', interaction.member],
        ['_CHANNEL_ID_', interaction.channelId],
        ['_ARGUMENTS_', argsString],
      ]),
    );
  }
}

export function registerSlash(sconf: discord.interactions.commands.ICommandConfig<any>, callback: discord.interactions.commands.HandlerFunction<any>, extras: SlashExtras) {
  if (extras.module !== TEMPORARY_SLASH_COMMANDS_MODULE_LIMITER) {
    return;
  }
  if (getTopLevelSlashCommands().length >= SLASH_COMMANDS_LIMIT) {
    return;
  }
  // add module name to the comamnd's description
  /* const prettyModule = `${extras.module.substr(0,1).toUpperCase()}${extras.module.substr(1).toLowerCase()}`;
  sconf.description = `[${prettyModule}] ${sconf.description}`; */
  discord.interactions.commands.register(sconf, async (interaction, ...args: any) => {
    await executeSlash(sconf, extras, callback, interaction, ...args);
  });
  registeredSlashCommands.push({ config: sconf, extras });
}

export function registerSlashGroup(sconf: discord.interactions.commands.ICommandConfig<any>, extras?: SlashExtras) {
  registeredSlashCommandGroups.push({ config: sconf, extras });
  if (extras.module !== TEMPORARY_SLASH_COMMANDS_MODULE_LIMITER) {
    return null;
  }
  if (getTopLevelSlashCommands().length >= SLASH_COMMANDS_LIMIT) {
    return null;
  }
  return discord.interactions.commands.registerGroup(sconf);
}

export function registerSlashSub(parent: discord.interactions.commands.SlashCommandGroup, sconf: discord.interactions.commands.ICommandConfig<any>, callback: discord.interactions.commands.HandlerFunction<any>, extras: SlashExtras) {
  if (extras.module !== TEMPORARY_SLASH_COMMANDS_MODULE_LIMITER) {
    return;
  }
  // add module name to the comamnd's description
  /* const prettyModule = `${extras.module.substr(0,1).toUpperCase()}${extras.module.substr(1).toLowerCase()}`;
  sconf.description = `[${prettyModule}] ${sconf.description}`; */
  parent.register(sconf, async (interaction, ...args: any) => {
    await executeSlash(sconf, extras, callback, interaction, ...args);
  });
  registeredSlashCommands.push({ config: sconf, extras });
}

const cooldowns: any = {};
export async function OnMessageCreate(
  id: string,
  guildId: string,
  msg: discord.Message,
) {
  if (
    !msg.content
    || typeof msg.content !== 'string'
    || msg.type !== discord.Message.Type.DEFAULT
  ) {
    return;
  }
  if (msg.author === null) {
    return;
  }

  if (!msg.member) {
    // is a DM

  } else {
    if (msg.author.bot && !utils.isCommandsAuthorized(msg.member)) {
      return;
    }
    if (typeof cooldowns[msg.author.id] === 'number') {
      const diff = Date.now() - cooldowns[msg.author.id];
      // global cmd cooldown!
      if (diff < 750) {
        return;
      }
    }
    const validCmd = await commands2.isCommand(msg);
    if (!validCmd) {
      return;
    }
    const guild = await msg.getGuild();
    const me = await guild!.getMember(discord.getBotId());
    const channel = await msg.getChannel();
    if (!channel || !me || channel instanceof discord.DmChannel) {
      return;
    }
    let isDevCmd = false;
    if (typeof conf.globalConfig.devPrefix === 'string' && msg.content.length > conf.globalConfig.devPrefix.length && msg.content.substr(0, conf.globalConfig.devPrefix.length) === conf.globalConfig.devPrefix) {
      isDevCmd = true;
    }
    if (!isDevCmd || !utils.isGlobalAdmin(msg.author.id)) {
      if (!channel.canMember(me, discord.Permissions.READ_MESSAGES) || !channel.canMember(me, discord.Permissions.SEND_MESSAGES) || !channel.canMember(me, discord.Permissions.EMBED_LINKS) || !channel.canMember(me, discord.Permissions.EXTERNAL_EMOJIS)) {
        return;
      }
    }
    if (isDevCmd === true && !utils.isGlobalAdmin(msg.author.id)) {
      return;
    }
    if (!utils.isCommandsAuthorized(msg.member)) {
      await utils.reportBlockedAction(msg.member, `command execution: \`${utils.escapeString(msg.content, true)}\``);
      return;
    }

    cooldowns[msg.author.id] = Date.now();
    const cmdExec = await commands2.handleCommand(msg);
    if (typeof cmdExec === 'boolean' && cmdExec === true) {
      if (!isDevCmd) {
        if (!isIgnoredChannel(msg.channelId) && !isIgnoredUser(msg.member)) {
          const parsedTxt = await utils.parseMentionables(msg.content);
          logCustom(
            'COMMANDS',
            'CHAT_COMMAND_USED',
            new Map<string, any>([
              ['_COMMAND_NAME_', utils.escapeString(parsedTxt, true)],
              ['_AUTHOR_', msg.author],
              ['_USER_', msg.author],
              ['_USER_ID_', msg.author.id],
              ['_MEMBER_', msg.member],
              ['_CHANNEL_ID_', msg.channelId],
            ]),
          );
        }
      }

      return false;
    }
    if (typeof cmdExec === 'boolean' && !cmdExec) {
      /* let isCmd2 = await HandleCommand(msg);
        if (!isCmd2) await HandleChat(msg); */
    } else {
      // original cmd errored!
      const _e: ApiError = cmdExec;
      utils.logError(_e);

      if (_e.messageExtended && typeof _e.messageExtended === 'string') {
        try {
          const emsg: any = JSON.parse(_e.messageExtended).message;
          if (emsg && emsg.toLowerCase() === 'missing permissions') {
            return;
          }
        } catch (e) {}
      }

      logDebug(
        'BOT_ERROR',
        new Map<string, any>([
          [
            'ERROR',
            `Command Error on '${msg.content}': \n${_e.stack}`,
          ],
        ]),
      );
    }
  }
}
