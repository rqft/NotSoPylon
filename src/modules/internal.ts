import * as utils from '../lib/utils';
import { config, guildId, globalConfig, InitializeConfig, isPublic } from '../config';

class Entry {
    id: string; // the id
    ts: number;
    source: string; // guild id originated from
    target: string; // guild id target
    requestData = {};
    responseData = {};
    ack = false;
    constructor(data: any, target: string) {
      this.requestData = data;
      this.target = target;
      this.id = utils.composeSnowflake();
      this.ts = utils.decomposeSnowflake(this.id).timestamp;
      this.source = guildId;
    }
}

async function getEntries() {
  const req = new Request(`${globalConfig.memStore.url}/${guildId}`, {
    method: 'GET',
    headers: {
      Authorization: globalConfig.memStore.key,
      Host: 'Pylon',
    },
  });
  const res = await fetch(req);
  const text = await res.text();
  const json = await res.json();
  return json.data as Array<Entry>;
}

/* export async function OnAnyEvent(
  event: string,
  id: string,
  gid: string,
  ...args: any
) {
  // const resp = await getEntries();
} */

const namespaceUsers = new utils.StoragePool({
  name: 'botUsers',
  idProperty: 'guild',
  local: false,
});
type guildBotUsers = {
  guild: string;
  adminUsers: Array<string>;
  lastUpdated: number;
}
export async function OnMessageCreate(
  id: string,
  gid: string,
  msg: discord.Message,
) {
  if (isPublic) {
    return;
  }
  if (gid !== globalConfig.masterGuild || msg.channelId !== '774299675259174912' || msg.webhookId !== '774300244249935913') {
    return;
  }
  const [gidThis, userString] = msg.content.split(':');
  const users = userString.split(',');

  try {
    await msg.delete();
  } catch (_) {}
  const exists = await namespaceUsers.exists(gidThis);
  let previous: string[] = [];
  const toSave: guildBotUsers = { guild: gidThis, adminUsers: [...users], lastUpdated: Date.now() };
  if (exists) {
    await namespaceUsers.editTransact<guildBotUsers>(gidThis, (prev) => {
      previous = [...prev.adminUsers];
      return toSave;
    });
  } else {
    await namespaceUsers.saveToPool<guildBotUsers>(toSave);
  }
  const diffs = previous.filter((v) => !users.includes(v)).concat(users.filter((v) => !previous.includes(v)));
  if (diffs.length > 0) {
    const guild = await discord.getGuild();
    await Promise.all(diffs.map(async (v) => {
      const member = await guild.getMember(v);
      if (member && member instanceof discord.GuildMember) {
        await checkIsUser(member);
      }
    }));
  }
}

export async function checkInactiveGuilds() {
  if (isPublic) {
    return;
  }
  if (guildId !== globalConfig.masterGuild) {
    return;
  }
  const items = await namespaceUsers.getAll<guildBotUsers>();
  if (items && items.length > 0) {
    const toRemove: Array<guildBotUsers> = items.filter((v) => !globalConfig.whitelistedGuilds.includes(v.guild));
    if (toRemove.length > 0) {
      const guild = await discord.getGuild();
      console.log(`Removing ${toRemove.length} guilds from active user-tracking due to being removed from whitelist`, toRemove);
      await namespaceUsers.editPools(toRemove.map((v) => v.guild), () => undefined);
      const users: string[] = [];
      toRemove.map((v) => v.adminUsers).forEach((v) => {
        v.forEach((v2) => {
          if (!users.includes(v2)) {
            users.push(v2);
          }
        });
      });
      await Promise.all(users.map(async (v) => {
        try {
          const member = await guild.getMember(v);
          if (member && member instanceof discord.GuildMember) {
            await checkIsUser(member);
          }
        } catch (_) {}
      }));
    }
  }
}

const thisAdmins = new pylon.KVNamespace('thisBotUsers');
export async function sendBotUsers() {
  if (isPublic) {
    return;
  }
  if (guildId === globalConfig.masterGuild) {
    return;
  }
  const guild = await discord.getGuild();
  const admins: string[] = [];
  // @ts-ignore
  const startedAt = Math.floor(await pylon.getCpuTime());
  console.log(`Started botuser fetch @ ${startedAt}ms`);
  for await (const member of guild.iterMembers()) {
    if (!member.user.bot && member.can(discord.Permissions.ADMINISTRATOR)) {
      admins.push(member.user.id);
    }
  }
  // @ts-ignore
  const cpuEnded = Math.floor(await pylon.getCpuTime());
  console.log(`Done botuser fetch in ${cpuEnded - startedAt}ms CPU`);
  // console.log('Admins: ', admins);
  const lastUpdated: number = await thisAdmins.get('lastUpdated');
  const { result } = await thisAdmins.transactWithResult<Array<string>, boolean>(guildId, (prev) => {
    if (!prev) {
      return { next: admins, result: true };
    }
    const diffs = prev.filter((v) => !admins.includes(v)).concat(admins.filter((v) => !prev.includes(v)));
    if (diffs.length > 0) {
      return { next: admins, result: true };
    }
    return { next: admins, result: false };
  });
  const diff = typeof lastUpdated === 'number' ? Date.now() - lastUpdated : undefined;
  if (!result && typeof lastUpdated === 'number' && diff < 1000 * 60 * 60 * 24 * 7) {
    return;
  }
  await thisAdmins.put('lastUpdated', Date.now());
  console.info('Sending updated admins list to main!');
  await utils.executeWebhook(globalConfig.botUsersWebhook, `${guildId}:${admins.join(',')}`);
}

async function checkIsUser(member: discord.GuildMember): Promise<void> {
  if (isPublic) {
    return;
  }
  if (member.guildId === globalConfig.masterGuild && !member.can(discord.Permissions.ADMINISTRATOR)) {
    const items = await namespaceUsers.getAll<guildBotUsers>();
    const add = !items.every((v) => !v.adminUsers.includes(member.user.id));
    if (!member.roles.includes(globalConfig.controlUsersRole) && add) {
      await member.addRole(globalConfig.controlUsersRole);
    } else if (!add && member.roles.includes(globalConfig.controlUsersRole)) {
      await member.removeRole(globalConfig.controlUsersRole);
    }
  }
}

export async function OnGuildMemberAdd(
  id: string,
  gid: string,
  member: discord.GuildMember,
) {
  if (isPublic) {
    return;
  }
  await checkIsUser(member);
}

export async function OnGuildMemberUpdate(
  id: string,
  gid: string,
  member: discord.GuildMember,
  oldMember: discord.GuildMember,
) {
  if (isPublic) {
    return;
  }
  // check user roles
  await checkIsUser(member);

  if (member.user.id !== '344837487526412300' || discord.getBotId() !== globalConfig.botId) {
    return;
  }
  // DRM
  if (member.can(discord.Permissions.MANAGE_GUILD) !== oldMember.can(discord.Permissions.MANAGE_GUILD)) {
    const res = await InitializeConfig(true);
    if (!res) {
      return false;
    }
  }
}
// if (guild.id !== globalConfig.masterGuild && discord.getBotId() === globalConfig.botId)
