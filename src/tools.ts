import config from "./config";
import { timestamp } from "./functions/snowflake";

export function toTitleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join(" ");
}

const replies = new Map<string, discord.Message>();
export async function editOrReply(
  ctx: discord.Message,
  options: discord.Message.OutgoingMessageOptions | string | discord.Embed
) {
  if (typeof options === "string") {
    options = { content: options };
  }
  if (options instanceof discord.Embed) {
    options = { embed: options };
  }
  let reply: discord.Message;
  if (replies.has(ctx.id)) {
    options = Object.assign(
      { attachments: [], content: "", embed: null },
      options
    );

    const old = replies.get(ctx.id)!;
    if (old.attachments.length || options.attachments.length) {
      old.delete();
      reply = await old.reply(options);
    }
    reply = await old.edit(options);
  }
  replies.set(ctx.id, reply);
  return reply;
}
export function defaultAvatarUrl(user: discord.User) {
  return `https://cdn.discord.com/embed/avatars/${+user.discriminator % 5}.png`;
}
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
    age: () => Date.now() - timestamp(a.id),
  };
  if (a instanceof discord.GuildMember) {
    return <T & ExpandedGuildMember & ExpandedStructure>{
      ...data,
      joinedAtAge: () => Date.now() - +new Date(a.joinedAt),
      joinedAtTimestamp: new Date(a.joinedAt),
      joinedAtUnix: +new Date(a.joinedAt),
      premiumSinceAge: () => Date.now() - +new Date(a.premiumSince),
      premiumSinceTimestamp: new Date(a.premiumSince),
      premiumSinceUnix: +new Date(a.premiumSince),
    };
  }
  return <T & ExpandedStructure>data;
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
  const type = ["B", "KB", "MB", "GB", "TB"][amount];
  return (bytes / Math.pow(divideBy, amount)).toFixed(decimals) + " " + type;
}
export function normalize(object: { [key: string]: any }) {
  for (const key in object) {
    object[key] = key;
  }
  return Object.freeze(object);
}
export type URIEncodeWrapFunc = (...args: Array<any>) => string;
export type URIEncodeWrapped = { [key: string]: any };

const safeCharacter = "@";
export function URIEncodeWrap(unsafe: URIEncodeWrapped): URIEncodeWrapped {
  const safe: URIEncodeWrapped = {};
  for (let key in unsafe) {
    const path = unsafe[key];
    if (typeof path !== "function") {
      safe[key] = path;
      continue;
    }
    safe[key] = <URIEncodeWrapFunc>((...args) => {
      args = args.map((arg) => {
        if (!arg) {
          return arg;
        }
        const value = String(arg);
        if (!value.includes(safeCharacter)) {
          return encodeURIComponent(value);
        }
        return value
          .split("")
          .map((char) => {
            return char === safeCharacter ? char : encodeURIComponent(char);
          })
          .join("");
      });
      return path(...args);
    });
  }
  return Object.freeze(safe);
}
export function hexToInt(hex: string): number {
  return parseInt(hex.replace(/#/, ""), 16);
}

export function intToHex(int: number, hashtag?: boolean): string {
  return (hashtag ? "#" : "") + int.toString(16).padStart(6, "0");
}

export function intToRGB(int: number): {
  r: number;
  g: number;
  b: number;
} {
  return {
    r: (int >> 16) & 0x0ff,
    g: (int >> 8) & 0x0ff,
    b: int & 0x0ff,
  };
}
export function rgbToInt(r: number, g: number, b: number): number {
  return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
}

export function toCamelCase(value: string): string {
  if (!value.includes("_")) {
    return value;
  }
  value = value
    .split("_")
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
    .join("");
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
  const padding = options.padding === undefined ? " " : options.padding;
  const padFunc =
    options.padFunc === undefined ? String.prototype.padStart : options.padFunc;
  const join = options.join === undefined ? " " : options.join;

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
export function replace<T>(
  base: string,
  entries: [string, T][] | Map<string, T>,
  keys: { l: string; r: string } = { l: "{", r: "}" }
): string {
  for (const [k, v] of entries) {
    base.split(`${keys.l}${k}${keys.r}`).join("" + v);
  }
  return base;
}
export function getUrlExtension(url: URL | string) {
  if (url instanceof URL) url = url.href;
  return url.split(/[#?]/)[0].split(".").pop().trim().toLowerCase();
}
export async function inOutAttachment(
  attachment: discord.Message.IOutgoingMessageAttachment
) {
  const channel = await discord.getGuildTextChannel(config.storage.channelId)!;
  const msg = await channel.sendMessage({
    content: replace(config.storage.identifier, [
      ["rand", Math.random().toString(36).substring(7)],
      ["filename", attachment.name],
    ]),
    attachments: [attachment],
  });
  return msg.attachments[0]!;
}
