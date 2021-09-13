import { codeblock, codestring } from "../../functions/markup";
import {
  BooleanEmojis,
  commands,
  DateOptions,
  Permissions,
  PermissionsText,
  PERMISSIONS_ADMIN,
  PERMISSIONS_TEXT,
  PERMISSIONS_VOICE,
} from "../../globals";
import { Parameters } from "../../parameters";
import {
  editOrReply,
  expandStructure,
  intToHex,
  intToRGB,
  padCodeBlockFromRows,
} from "../../tools";
import {
  asyncIteratorToArray,
  createColorUrl,
  permissionsToObject,
} from "../../util";

commands.on(
  {
    name: "role",
    description: "Get information for a role, defaults to the @everyone role",
  },
  (args) => ({
    _role: args.stringOptional({ default: "@everyone" }),
    channel: args.guildChannelOptional(),
  }),
  async (message, args) => {
    const role = expandStructure(await Parameters.role(args._role, message));
    const channel = args.channel ?? (await message.getChannel());
    const guild = await discord.getGuild(role.guildId);
    const guildMembers = await asyncIteratorToArray(guild.iterMembers());
    const embed = new discord.Embed();
    embed.setAuthor({ name: role.name });
    embed.setDescription(
      `Showing channel permissions for ${role.toMention()} in ${channel.toMention()}`
    );
    if (role.color) {
      embed.setColor(role.color);

      const url = createColorUrl(role.color);
      embed.setAuthor({ name: role.name, url });
    }

    {
      const description: Array<string> = [];

      if (role.color) {
        const color = intToRGB(role.color);
        const hex = codestring(intToHex(role.color, true));
        const rgb = codestring(`(${color.r}, ${color.g}, ${color.b})`);
        description.push(`**Color**: ${hex} ${rgb}`);
      } else {
        description.push(`**Color**: No Color`);
      }
      description.push(
        `**Created**: ${role.createdAt.toLocaleString("en-US", DateOptions)}`
      );
      description.push(
        `**Default Role**: ${role.id === role.guildId ? "Yes" : "No"}`
      );
      description.push(`**Hoisted**: ${role.hoist ? "Yes" : "No"}`);
      description.push(`**Id**: \`${role.id}\``);
      description.push(`**Managed**: ${role.managed ? "Yes" : "No"}`);
      description.push(`**Mentionable**: ${role.mentionable ? "Yes" : "No"}`);
      if (role.guildId) {
        const position =
          (await guild.getRoles())
            .sort((x, y) => x.position - y.position)
            .findIndex((r) => r.id === role.id) + 1;
        description.push(
          `**Position**: ${role.position} (${position}/${
            (await guild.getRoles()).length
          })`
        );
      } else {
        description.push(`**Position**: ${role.position}`);
      }
      //   if (role.tags) {
      //     if (role.isBoosterRole) {
      //       description.push("**Type**: Booster Role");
      //     } else if (role.botId) {
      //       description.push(`**Type**: Bot Role (for <@${role.botId}>)`);
      //     } else if (role.integrationId) {
      //       description.push(
      //         `**Type**: Integration Role (${role.integrationId})`
      //       );
      //     } else {
      //       description.push(`**Type**: Unknown (${JSON.stringify(role.tags)})`);
      //     }
      //   }

      embed.addField({
        name: "Information",
        value: description.join("\n"),
        inline: true,
      });
    }

    {
      const members = guildMembers.filter((v) => v.roles.includes(role.id));
      const description: Array<string> = [];

      description.push(`Members: ${members.length.toLocaleString()}`);
      if (description.length) {
        embed.addField({
          name: "Counts",
          value: codeblock(description.join("\n"), { language: "css" }),
          inline: true,
        });
      }
    }

    embed.addField({ name: "\u200b", value: "\u200b" });
    {
      const permissions = permissionsToObject(channel.getRolePermissions(role));

      {
        const rows: Array<Array<string>> = [];

        for (const permission of PERMISSIONS_ADMIN) {
          const key = String(permission);
          const can = permissions[key];
          rows.push([
            `${PermissionsText[key]}:`,
            `${can ? BooleanEmojis.YES : BooleanEmojis.NO}`,
          ]);
        }

        embed.addField({
          name: "Moderation",
          value: codeblock(padCodeBlockFromRows(rows).join("\n"), {
            language: "css",
          }),
          inline: true,
        });
      }

      if (channel instanceof discord.GuildTextChannel) {
        const rows: Array<Array<string>> = [];

        for (const permission of PERMISSIONS_TEXT) {
          const key = String(permission);
          const can = permissions[key];
          rows.push([
            `${PermissionsText[key]}:`,
            `${can ? BooleanEmojis.YES : BooleanEmojis.NO}`,
          ]);
        }

        embed.addField({
          name: "Text",
          value: codeblock(padCodeBlockFromRows(rows).join("\n"), {
            language: "css",
          }),
          inline: true,
        });
      } else if (channel instanceof discord.GuildVoiceChannel) {
        const rows: Array<Array<string>> = [];

        for (const permission of PERMISSIONS_VOICE) {
          const key = String(permission);
          const can = permissions[key];
          rows.push([
            `${PermissionsText[key]}:`,
            `${can ? BooleanEmojis.YES : BooleanEmojis.NO}`,
          ]);
        }

        embed.addField({
          name: "Voice",
          value: codeblock(padCodeBlockFromRows(rows).join("\n"), {
            language: "css",
          }),
          inline: true,
        });
      }
    }

    return editOrReply(message, { embed });
  }
);
