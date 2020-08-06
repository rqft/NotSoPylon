import { handleEvent, getUserTag, getMemberTag } from '../main';
import * as utils from '../../../lib/utils';

export function getKeys(
  log: discord.AuditLogEntry,
  role: discord.Role,
  oldRole: discord.Role
) {
  let keys = new Array();
  if (role.name !== oldRole.name) keys.push('name');
  if (role.color !== oldRole.color) keys.push('color');
  if (role.hoist !== oldRole.hoist) keys.push('hoist');
  if (role.mentionable !== oldRole.mentionable) keys.push('mentionable');
  if (role.managed !== oldRole.managed) keys.push('managed'); // why not
  if (role.position !== oldRole.position) keys.push('position');
  if (role.permissions !== oldRole.permissions) keys.push('permissions');
  return keys;
}

export function isAuditLog(log: discord.AuditLogEntry) {
  return log instanceof discord.AuditLogEntry;
}

export const messages = {
  name: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'NAME_CHANGED']
    ]);
    mp.set('_OLD_NAME_', utils.escapeString(oldRole.name));
    mp.set('_NEW_NAME_', utils.escapeString(role.name));
    return mp;
  },
  color: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'COLOR_CHANGED']
    ]);
    mp.set('_OLD_COLOR_', oldRole.color.toString(16));
    mp.set('_NEW_COLOR_', role.color.toString(16));
    return mp;
  },
  hoist: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'HOIST_CHANGED']
    ]);
    mp.set('_OLD_HOIST_', oldRole.hoist === true ? 'Enabled' : 'Disabled');
    mp.set('_NEW_HOIST_', role.hoist === true ? 'Enabled' : 'Disabled');
    return mp;
  },
  mentionable: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'MENTIONABLE_CHANGED']
    ]);
    mp.set(
      '_OLD_MENTIONABLE_',
      oldRole.mentionable === true ? 'Enabled' : 'Disabled'
    );
    mp.set(
      '_NEW_MENTIONABLE_',
      role.mentionable === true ? 'Enabled' : 'Disabled'
    );
    return mp;
  },
  position: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'POSITION_CHANGED']
    ]);
    mp.set('_OLD_POSITION_', oldRole.position.toString());
    mp.set('_NEW_POSITION_', role.position.toString());
    return mp;
  },
  managed: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([
      ['_ROLE_ID_', role.id],
      ['_TYPE_', 'MANAGED_CHANGED']
    ]);
    mp.set(
      '_OLD_MANAGED_',
      oldRole.mentionable === true ? 'Enabled' : 'Disabled'
    );
    mp.set('_NEW_MANAGED_', role.mentionable === true ? 'Enabled' : 'Disabled');
    return mp;
  },
  permissions: function(
    log: discord.AuditLogEntry,
    role: discord.Role,
    oldRole: discord.Role
  ) {
    let mp = new Map([['_ROLE_ID_', role.id]]);
    let type = '';
    let newPerms = new utils.Permissions(role.permissions).serialize();
    let oldPerms = new utils.Permissions(oldRole.permissions).serialize();
    let permsAdded = new Array<string>();
    let permsRemoved = new Array<string>();
    for (let key in newPerms) {
      if (newPerms[key] === true && oldPerms[key] === false)
        permsAdded.push(key);
      if (newPerms[key] === false && oldPerms[key] === true)
        permsRemoved.push(key);
    }
    function prettifyPerms(e: string) {
      return e
        .split('_')
        .join(' ')
        .split(' ')
        .map(function(e) {
          if (e.length > 1)
            e = e.substring(0, 1).toUpperCase() + e.substring(1).toLowerCase();
          return e;
        })
        .join(' ');
    }
    if (permsAdded.length > 0 && permsRemoved.length === 0) {
      type = 'PERMS_ADDED';
      mp.set(
        '_ADDED_PERMS_',
        permsAdded
          .map(function(e: string) {
            return '`' + prettifyPerms(e) + '`';
          })
          .join(',  ')
      );
    } else if (permsAdded.length === 0 && permsRemoved.length > 0) {
      type = 'PERMS_REMOVED';
      mp.set(
        '_REMOVED_PERMS_',
        permsRemoved
          .map(function(e: string) {
            return '`' + prettifyPerms(e) + '`';
          })
          .join(',  ')
      );
    } else {
      type = 'PERMS_CHANGED';
      let cc = permsAdded
        .map(function(e: string) {
          return `+ ${prettifyPerms(e)}`;
        })
        .concat(
          permsRemoved.map(function(e: string) {
            return `- ${prettifyPerms(e)}`;
          })
        )
        .join('\n');
      cc = '```diff\n' + cc + '\n```';
      mp.set('_CHANGED_PERMS_', cc);
    }
    if (type === '') return;
    mp.set('_TYPE_', type);
    return mp;
  }
};

export async function AL_OnGuildRoleUpdate(
  id: string,
  guildId: string,
  log: any,
  role: discord.Role,
  oldRole: discord.Role
) {
  await handleEvent(
    id,
    guildId,
    discord.Event.GUILD_ROLE_UPDATE,
    log,
    role,
    oldRole
  );
}
