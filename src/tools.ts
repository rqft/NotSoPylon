import config from './config';
import { timestamp } from './functions/snowflake';
import { replace } from './util';

export function toTitleCase(value: string): string {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join(' ');
}

const replies = new Map<string, discord.Message>();
export async function editOrReply(
  ctx: discord.Message,
  options: discord.Message.OutgoingMessageOptions | string | discord.Embed
) {
  if (typeof options === 'string') options = { content: options };
  if (options instanceof discord.Embed) options = { embed: options };
  return await ctx.inlineReply(Object.assign({ allowedMentions: {} }, options));
}
export function defaultAvatarUrl(user: discord.User) {
  return `https://cdn.discord.com/embed/avatars/${+user.discriminator % 5}.png`;
}
export type GuildMemberId = discord.GuildMember & { id: string };
export type ExpandedStructure = {
  createdAt: Date;
  createdAtUnix: number;
  age: () => number;
};
export type ExpandedGuildMember = ExpandedStructure & {
  joinedAtUnix: number;
  joinedAtTimestamp: Date;
  joinedAtAge: () => number;
  premiumSinceUnix: number;
  premiumSinceTimestamp: Date;
  premiumSinceAge: () => number;
};
export function expandStructure<T>(
  a: T & { id: string }
): (T & ExpandedStructure) | (T & ExpandedGuildMember) {
  const data = {
    ...a,
    createdAt: new Date(timestamp(a.id)),
    createdAtUnix: timestamp(a.id),
    age: () => Date.now() - timestamp(a.id)
  };
  if ('joinedAt' in a) {
    return {
      ...data,
      joinedAtAge: () => Date.now() - +new Date((a as GuildMemberId).joinedAt),
      joinedAtTimestamp: new Date((a as GuildMemberId).joinedAt),
      joinedAtUnix: +new Date((a as GuildMemberId).joinedAt),
      premiumSinceAge: () =>
        Date.now() - +new Date((a as GuildMemberId).premiumSince!),
      premiumSinceTimestamp: new Date((a as GuildMemberId).premiumSince!),
      premiumSinceUnix: +new Date((a as GuildMemberId).premiumSince!)
    } as T & ExpandedGuildMember & ExpandedStructure;
  }
  return data as T & ExpandedStructure;
}

export function guildIdToShardId(
  guildId: string,
  shardCount: number = 0
): number {
  return Math.round(+guildId / (1 << 22)) % shardCount;
}
export function formatMemory(bytes: number, decimals: number = 0): string {
  const divideBy = 1024;
  const amount = Math.floor(Math.log(bytes) / Math.log(divideBy));
  const type = ['B', 'KB', 'MB', 'GB', 'TB'][amount];
  return (bytes / Math.pow(divideBy, amount)).toFixed(decimals) + ' ' + type;
}
export function normalize(object: { [key: string]: any }) {
  for (const key in object) {
    object[key] = key;
  }
  return Object.freeze(object);
}
export type URIEncodeWrapFunc = (...args: Array<any>) => string;
export type URIEncodeWrapped = { [key: string]: any };

const safeCharacter = '@';
export function URIEncodeWrap(unsafe: URIEncodeWrapped): URIEncodeWrapped {
  const safe: URIEncodeWrapped = {};
  for (let key in unsafe) {
    const path = unsafe[key];
    if (typeof path !== 'function') {
      safe[key] = path;
      continue;
    }
    safe[key] = ((...args) => {
      args = args.map((arg) => {
        if (!arg) {
          return arg;
        }
        const value = String(arg);
        if (!value.includes(safeCharacter)) {
          return encodeURIComponent(value);
        }
        return value
          .split('')
          .map((char) => {
            return char === safeCharacter ? char : encodeURIComponent(char);
          })
          .join('');
      });
      return path(...args);
    }) as URIEncodeWrapFunc;
  }
  return Object.freeze(safe);
}
export function hexToInt(hex: string): number {
  return parseInt(hex.replace(/#/, ''), 16);
}

export function intToHex(int: number, hashtag?: boolean): string {
  return (hashtag ? '#' : '') + int.toString(16).padStart(6, '0');
}
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s: number,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(r * 255),
    s: Math.round(g * 255),
    l: Math.round(b * 255)
  };
}
export function intToRGB(
  int: number
): {
  r: number;
  g: number;
  b: number;
} {
  return {
    r: (int >> 16) & 0x0ff,
    g: (int >> 8) & 0x0ff,
    b: int & 0x0ff
  };
}
export function rgbToInt(r: number, g: number, b: number): number {
  return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
}

export function toCamelCase(value: string): string {
  if (!value.includes('_')) {
    return value;
  }
  value = value
    .split('_')
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
    .join('');
  return value.charAt(0).toLowerCase() + value.slice(1);
}
export function padCodeBlockFromRows(
  strings: Array<Array<string>>,
  options: {
    join?: string;
    padding?: string;
    padFunc?: (targetLength: number, padString?: string) => string;
  } = {}
): Array<string> {
  const padding = options.padding === undefined ? ' ' : options.padding;
  const padFunc =
    options.padFunc === undefined ? String.prototype.padStart : options.padFunc;
  const join = options.join === undefined ? ' ' : options.join;

  const columns: Array<Array<string>> = [];
  const columnsAmount = strings.reduce((x, row) => Math.max(x, row.length), 0);

  for (let i = 0; i < columnsAmount; i++) {
    const column: Array<string> = [];

    let max = 0;
    for (const row of strings) {
      if (i in row) {
        max = Math.max(max, row[i].length);
      }
    }
    for (const row of strings) {
      if (i in row) {
        column.push(padFunc.call(row[i], max, padding));
      }
    }
    columns.push(column);
  }

  const rows: Array<string> = [];
  for (let i = 0; i < strings.length; i++) {
    const row: Array<string> = [];
    for (const column of columns) {
      if (i in column) {
        row.push(column[i]);
      }
    }
    rows.push(row.join(join));
  }
  return rows;
}

export function getUrlExtension(url: URL | string) {
  if (url instanceof URL) url = url.href;
  return (
    url
      .split(/[#?]/)[0]
      .split('.')
      .pop() || ''
  )
    .trim()
    .toLowerCase();
}
export async function inOutAttachment(
  attachment: discord.Message.IOutgoingMessageAttachment
) {
  const channel = (await discord.getGuildTextChannel(
    config.storage.channelId
  ))!;
  const rand = Math.random()
    .toString(36)
    .substring(7);
  const msg = await channel.sendMessage({
    content: replace(config.storage.identifier, {
      rand,
      filename: attachment.name
    }),
    attachments: [attachment]
  });
  return { attachment: msg.attachments[0]!, rand, msg };
}
export function splitArray<T>(
  array: Array<T>,
  amount: number
): Array<Array<T>> {
  const pages: Array<Array<T>> = [];

  const chunkAmount = Math.max(Math.round(array.length / amount), 1);
  for (let i = 0; i < amount; i++) {
    const position = i * chunkAmount;
    pages.push(array.slice(position, position + chunkAmount));
  }
  return pages;
}
export interface FormatPercentageAsBarOptions {
  bars?: number;
  total?: number;
}

export function formatPercentageAsBar(
  percentage: number,
  options: FormatPercentageAsBarOptions = {}
): string {
  const bars = options.bars || 30;
  const total = options.total || 100;

  const fraction = Math.round(percentage) / total;
  const amount = Math.floor(fraction * bars);

  const bar = '#'.repeat(amount);
  return (bar + ' '.repeat(Math.max(bars - amount, 0))).slice(0, bars);
}
export function validateUrl(value: string): boolean {
  return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}
export function toCodePoint(
  unicodeSurrogates: string,
  separator: string = '-'
) {
  const r: Array<string> = [];
  let c: number = 0;
  let p: number = 0;
  let i: number = 0;

  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
      p = 0;
    } else if (0xd800 <= c && c <= 0xdbff) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join(separator);
}
export function bitfieldToArray<T>(bitfield: number | bigint, array: T[]): T[];
export function bitfieldToArray(bitfield: number | bigint, array: any[]): any[];
export function bitfieldToArray(bitfield: number | bigint, array: any[]) {
  bitfield = BigInt(bitfield);
  return array.filter((_, i) => {
    const current = BigInt(1 << i);
    return ((bitfield as bigint) & current) === current;
  });
}
