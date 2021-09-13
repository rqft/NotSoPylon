import { NotSoPylon } from "./endpoints";
import {
  GuildFeature,
  LocalesText,
  MAX_ATTACHMENT_SIZE,
  MAX_BITRATE,
  MAX_EMOJI_SLOTS,
  MAX_EMOJI_SLOTS_MORE,
  Permissions,
  PremiumGuildLimits,
  PremiumGuildTiers,
  timeMap,
} from "./globals";
import { intToHex } from "./tools";

export async function asyncIteratorToArray<T>(
  iterator: AsyncIterableIterator<T>
) {
  const u: Array<T> = [];
  for await (let i of iterator) u.push(i);
  return u;
}
export function iteratorToArray<T>(iterator: IterableIterator<T>) {
  const u: Array<T> = [];
  for (let i of iterator) u.push(i);
  return u;
}

export function createUserEmbed(
  user: discord.User,
  embed: discord.Embed = new discord.Embed()
) {
  embed.setAuthor({
    name: user.getTag(),
    iconUrl: user.getAvatarUrl(),
    url: `https://discord.com/users/${user.id}`,
  });
  return embed;
}

export function formatEmoji(
  emoji: discord.Emoji | discord.Presence.IActivityEmoji
) {
  return emoji.id
    ? `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
    : emoji.name;
}
export function emojiToUrl(
  emoji: discord.Emoji | discord.Presence.IActivityEmoji,
  format?: discord.ImageType,
  size?: number
) {
  if (!emoji.id) {
    throw new Error("Cannot get a URL of a standard Emoji.");
  }
  if (!format) {
    if (emoji.animated) format = discord.ImageType.GIF;
    else format = discord.ImageType.PNG;
  }
  const valid = [discord.ImageType.PNG, discord.ImageType.GIF];
  if (!valid.includes(format)) {
    throw new Error(
      `Invalid format: '${format}', valid: ${JSON.stringify(valid)}`
    );
  }
  return `https://cdn.discordapp.com/emojis/${emoji.id}.${format}${
    size ? `?size=${size}` : ""
  }`;
}
export function activityToTypeText(activity: discord.Presence.IActivity) {
  switch (activity.type) {
    case discord.Presence.ActivityType.GAME:
      return "Playing";
    case discord.Presence.ActivityType.STREAMING:
      return "Streaming";
    case discord.Presence.ActivityType.LISTENING:
      return "Listening to";
    case discord.Presence.ActivityType.WATCHING:
      return "Watching";
    case discord.Presence.ActivityType.CUSTOM:
      return "";
  }
  return "Unknown";
}
export enum ActivityPlatformTypes {
  ANDROID = "android",
  DESKTOP = "desktop",
  EMBEDDED = "embedded",
  IOS = "ios",
  SAMSUNG = "samsung",
  XBOX = "xbox",
}
export interface FormatTimeOptions {
  day?: boolean;
  ms?: boolean;
}
export function formatTime(
  ms: number,
  options: FormatTimeOptions = {}
): string {
  const showDays = options.day || options.day === undefined;
  const showMs = !!options.ms;

  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let milliseconds = ms % 1000;

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  const daysStr = days ? `${days}d` : "";
  const hoursStr = `0${hours}`.slice(-2);
  const minutesStr = `0${minutes}`.slice(-2);
  const secondsStr = `0${seconds}`.slice(-2);
  const millisecondsStr = `00${milliseconds}`.slice(-3);

  let time = `${minutesStr}:${secondsStr}`;
  if (hours) {
    time = `${hoursStr}:${time}`;
  }
  if (showMs) {
    time = `${time}.${millisecondsStr}`;
  }
  if (showDays && days) {
    time = `${daysStr} ${time}`;
  }
  return time;
}
export function getElapsedTime(
  timestamps: discord.Presence.IActivityTimestamps
): number {
  let elapsed: number;
  if (timestamps.start) {
    elapsed = Math.max(Date.now() - +timestamps.start, 0);
  } else {
    elapsed = Date.now();
  }

  const total = getTotalTime(timestamps);
  if (total) {
    return Math.min(elapsed, total);
  }
  return elapsed;
}

export function getTotalTime(
  timestamps: discord.Presence.IActivityTimestamps
): number {
  if (timestamps.end) {
    if (timestamps.start) {
      return +timestamps.end - +timestamps.start;
    }
    return +timestamps.end;
  }
  return 0;
}
export function emojiIdentifier(emoji: discord.Emoji) {
  if (emoji.id) {
    return `${emoji.name}:${emoji.id}`;
  }
  return emoji.name;
}
export function parseFlagArguments(
  argument: string,
  flags: { [key: string]: string }
) {
  argument.split(" ");
}

export function getLongAgoFormat(
  ts: number,
  limiter: number,
  diffSinceNow: boolean = true,
  lowestUnit: string | undefined = undefined
) {
  //return getDiscordTimestamp(ts, 'R')
  if (diffSinceNow) ts = new Date(new Date().getTime() - ts).getTime();
  let runcheck = ts + 0;
  const txt = new Map();
  for (const [k, v] of timeMap) {
    if (runcheck < v || txt.entries.length >= limiter) {
      continue;
    }
    const runs = Math.ceil(runcheck / v) + 1;
    for (let i = 0; i <= runs; i += 1) {
      if (runcheck < v) {
        break;
      }
      if (txt.has(k)) {
        txt.set(k, txt.get(k) + 1);
      } else {
        txt.set(k, 1);
      }
      runcheck -= v;
    }
  }
  const txtret = [];
  let runsc = 0;
  let hitLowest = false;
  for (const [key, value] of txt) {
    if (runsc >= limiter || hitLowest === true) {
      break;
    }
    if (lowestUnit === key) hitLowest = true;
    let cc: string = key;
    if (value > 1) {
      //   for (const keyLang in languageMap) {
      //     if (languageMap[keyLang] === key)
      //       cc = i18n.language.time_units.ti_full.plural[keyLang];
      //   }
      cc += "s";
    }
    cc = `${cc.substr(0, 1).toUpperCase()}${cc.substr(1).toLowerCase()}`;
    txtret.push(`${value} ${cc}`);
    runsc += 1;
  }
  return txtret.join(", ");
}
export function guildJumplink(guildId?: string) {
  return `https://discord.com/channels/${guildId || "@me"}`;
}
export function channelJumplink(
  channel: discord.Channel | discord.Invite.ChannelData,
  guildId?: string
) {
  guildId ??= channel instanceof discord.GuildChannel ? channel.guildId : "@me";
  return guildJumplink(guildId) + `/${channel.id}`;
}
export function getAcronym(name?: string): string {
  if (name != null) {
    return name.replace(/\w+/g, (match) => match[0]).replace(/\s/g, "");
  }
  return "";
}
export function preferredLocaleText(guild: discord.Guild): string {
  if (guild.preferredLocale in LocalesText) {
    return LocalesText[this.preferredLocale];
  }
  return "";
}

export function guildHasFeature(guild: discord.Guild, feature: GuildFeature) {
  const features: Array<string> = guild.features;
  return features.includes(feature);
}
export function guildHasPublic(guild: discord.Guild) {
  const features: Array<string> = guild.features;
  return (
    guildHasFeature(guild, GuildFeature.PUBLIC) &&
    !guildHasFeature(guild, GuildFeature.PUBLIC_DISABLED)
  );
}
export function getMaxAttachmentSize(guild: discord.Guild): number {
  const max = MAX_ATTACHMENT_SIZE;
  return Math.max(
    max,
    (PremiumGuildLimits as any)[guild.premiumTier].attachment
  );
}

export function getMaxBitrate(guild: discord.Guild): number {
  let max = MAX_BITRATE;
  if (guildHasFeature(guild, GuildFeature.VIP_REGIONS)) {
    max = (PremiumGuildLimits as any)[PremiumGuildTiers.TIER_3].bitrate;
  }
  return Math.max(max, (PremiumGuildLimits as any)[guild.premiumTier].bitrate);
}

export function getMaxEmojis(guild: discord.Guild): number {
  const max = guildHasFeature(guild, GuildFeature.MORE_EMOJI)
    ? MAX_EMOJI_SLOTS_MORE
    : MAX_EMOJI_SLOTS;
  return Math.max(max, (PremiumGuildLimits as any)[guild.premiumTier].emoji);
}
export enum Urls {
  BLOG = "https://blog.discord.com/",
  CANARY = "https://canary.discord.com/",
  CDN = "https://cdn.discordapp.com/",
  FEEDBACK = "https://feedback.discord.com/",
  GIFT = "https://discord.gift/",
  INVITE = "https://discord.gg/",
  MEDIA = "https://media.discordapp.net/",
  ROUTER = "https://router.discordapp.net/",
  STABLE = "https://discord.com/",
  STABLE_OLD = "https://discordapp.com/",
  STATUS = "https://status.discord.com/",
  SUPPORT = "https://support.discord.com/",
  SUPPORT_DEV = "https://support-dev.discord.com/",
  TEMPLATE = "https://discord.new/",
}
export const getGuildIcon = (
  guildId: string,
  hash: string,
  format: string = "png"
): string => `${Urls.CDN}icons/${guildId}/${hash}.${format}`;
export async function apiping(): Promise<{ gateway: number; rest: number }> {
  return {
    gateway: await latency(discord.getBotUser),
    rest: await latency(discord.getGuild),
  };
}
export async function latency(cb: (...a: any) => any) {
  const start = Date.now();
  await cb();
  return Date.now() - start;
}

export function isSnowflake(value: string): boolean {
  if (16 <= value.length && value.length <= 21) {
    return !!parseInt(value);
  }
  return false;
}
export interface RouteParameters {
  [key: string]: any;
}
export const PathReplacementRegexp = /:(\w+):?/g;
export function replacePathParameters(
  path: string,
  parameters: RouteParameters = {}
): string {
  return path.replace(PathReplacementRegexp, (match: string, key: string) => {
    if (key in parameters) {
      return encodeURIComponent(String(parameters[key]));
    }
    return match;
  });
}

export function createColorUrl(color: number): string {
  return replacePathParameters(
    NotSoPylon.Api.URL_PUBLIC +
      NotSoPylon.Api.PATH +
      NotSoPylon.Api.IMAGE_CREATE_COLOR_HEX,
    {
      format: "png",
      height: 2,
      hex: intToHex(color),
      width: 2,
    }
  );
}
export type PermissionChecks =
  | Array<bigint | number | string>
  | bigint
  | number
  | string;

export function checkPermissions(
  permissions: bigint | number,
  check: PermissionChecks
): boolean {
  if (typeof permissions !== "number" && typeof permissions !== "bigint") {
    throw new Error("Permissions has to be an integer");
  }

  permissions = BigInt(permissions);
  switch (typeof check) {
    case "bigint": {
      return (permissions & check) === check;
    }
    case "number": {
      return checkPermissions(permissions, BigInt(check));
    }
    case "object":
      {
        if (Array.isArray(check)) {
          return check.every((value) => checkPermissions(permissions, value));
        }
      }
      break;
    case "string": {
      check = check.toUpperCase();
      if (check in Permissions) {
        return checkPermissions(
          permissions,
          (Permissions as any)[check] as bigint
        );
      } else {
        throw new Error(`Unknown Permission: ${check}`);
      }
    }
  }

  throw new Error(
    "Only a string, integer, or an array of strings/integers are allowed to check with."
  );
}
export function permissionsToObject(
  permissions: bigint | number
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (let check of Object.values(Permissions)) {
    if (check === Permissions.NONE) {
      continue;
    }
    result[String(check)] = checkPermissions(permissions, check);
  }
  return result;
}
