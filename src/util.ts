import { NotSoPylon } from './endpoints';
import { codeblock, Regexes } from './functions/markup';
import {
  EmbedBrands,
  EmbedColors,
  GuildFeature,
  LocalesText,
  MAX_ATTACHMENT_SIZE,
  MAX_BITRATE,
  MAX_EMOJI_SLOTS,
  MAX_EMOJI_SLOTS_MORE,
  Permissions,
  PremiumGuildLimits,
  PremiumGuildTiers,
  timeMap
} from './globals';
import { Tag, TagEmbedThumbnails } from './functions/tag';
import {
  formatMemory,
  formatPercentageAsBar,
  inOutAttachment,
  intToHex
} from './tools';

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
    url: `https://discord.com/users/${user.id}`
  });
  return embed;
}
export async function createImageEmbed(
  image:
    | ArrayBuffer
    | discord.Message.IMessageAttachment
    | discord.Message.IOutgoingMessageAttachment
    | string
    | URL,
  context: discord.GuildMemberMessage,
  name?: string
) {
  let storedAs;
  if (typeof image === 'string') image = new URL(image);
  if (image instanceof URL) {
    image = await (await fetch(image.href)).arrayBuffer();
  }
  if (image instanceof ArrayBuffer) {
    image = { name: 'image.png', data: image };
  }
  if (!('height' in image)) {
    const img = await inOutAttachment(
      image as discord.Message.IOutgoingMessageAttachment
    );
    storedAs = img.rand;
    image = img.attachment;
  }
  let filename = '';
  if (name) filename = name;
  else if (image.filename) filename = image.filename;
  else filename = `edited-image.${getFileExtension(image)}`;

  const embed = createUserEmbed(context.author);
  embed.setColor(EmbedColors.DARK_MESSAGE_BACKGROUND);

  embed.setImage({ url: image.url });
  let footer = `${filename}, ${image.width}x${image.height}`;
  if (getFileExtension(image) === discord.ImageType.GIF)
    footer = `${footer}, ${formatMemory(image.size)}`;
  if (storedAs) footer = `${footer}, stored as ${storedAs}`;
  embed.setFooter({ text: footer });
  return embed;
}

export function formatEmoji(
  emoji: discord.Emoji | discord.Presence.IActivityEmoji
) {
  return emoji.id
    ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`
    : emoji.name;
}
export function emojiToUrl(
  emoji: discord.Emoji | discord.Presence.IActivityEmoji,
  format?: discord.ImageType,
  size?: number
) {
  if (!emoji.id) {
    throw new Error('Cannot get a URL of a standard Emoji.');
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
    size ? `?size=${size}` : ''
  }`;
}
export function activityToTypeText(activity: discord.Presence.IActivity) {
  switch (activity.type) {
    case discord.Presence.ActivityType.GAME:
      return 'Playing';
    case discord.Presence.ActivityType.STREAMING:
      return 'Streaming';
    case discord.Presence.ActivityType.LISTENING:
      return 'Listening to';
    case discord.Presence.ActivityType.WATCHING:
      return 'Watching';
    case discord.Presence.ActivityType.CUSTOM:
      return '';
  }
  return 'Unknown';
}
export enum ActivityPlatformTypes {
  ANDROID = 'android',
  DESKTOP = 'desktop',
  EMBEDDED = 'embedded',
  IOS = 'ios',
  SAMSUNG = 'samsung',
  XBOX = 'xbox'
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

  const daysStr = days ? `${days}d` : '';
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
export function getTimeline(
  timestamps: discord.Presence.IActivityTimestamps,
  bars: number
) {
  return formatPercentageAsBar(getElapsedTime(timestamps), {
    total: getTotalTime(timestamps),
    bars
  });
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
  argument.split(' ');
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
      cc += 's';
    }
    cc = `${cc.substr(0, 1).toUpperCase()}${cc.substr(1).toLowerCase()}`;
    txtret.push(`${value} ${cc}`);
    runsc += 1;
  }
  return txtret.join(', ');
}
export function guildJumplink(guildId?: string) {
  return `https://discord.com/channels/${guildId || '@me'}`;
}
export function channelJumplink(
  channel: discord.Channel | discord.Invite.ChannelData,
  guildId?: string
) {
  guildId =
    guildId ??
    (channel instanceof discord.GuildChannel ? channel.guildId : '@me');
  return guildJumplink(guildId) + `/${channel.id}`;
}
export function getAcronym(name?: string): string {
  if (name != null) {
    return name.replace(/\w+/g, (match) => match[0]).replace(/\s/g, '');
  }
  return '';
}
export function preferredLocaleText(guild: discord.Guild): string {
  if (guild.preferredLocale in LocalesText) {
    // @ts-ignore
    return LocalesText[guild.preferredLocale];
  }
  return '';
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
    (PremiumGuildLimits as any)[guild.premiumTier || 0].attachment
  );
}

export function getMaxBitrate(guild: discord.Guild): number {
  let max = MAX_BITRATE;
  if (guildHasFeature(guild, GuildFeature.VIP_REGIONS)) {
    max = (PremiumGuildLimits as any)[PremiumGuildTiers.TIER_3].bitrate;
  }
  return Math.max(
    max,
    (PremiumGuildLimits as any)[guild.premiumTier || 0].bitrate
  );
}

export function getMaxEmojis(guild: discord.Guild): number {
  const max = guildHasFeature(guild, GuildFeature.MORE_EMOJI)
    ? MAX_EMOJI_SLOTS_MORE
    : MAX_EMOJI_SLOTS;
  return Math.max(
    max,
    (PremiumGuildLimits as any)[guild.premiumTier || 0].emoji
  );
}
export enum Urls {
  BLOG = 'https://blog.discord.com/',
  CANARY = 'https://canary.discord.com/',
  CDN = 'https://cdn.discordapp.com/',
  FEEDBACK = 'https://feedback.discord.com/',
  GIFT = 'https://discord.gift/',
  INVITE = 'https://discord.gg/',
  MEDIA = 'https://media.discordapp.net/',
  ROUTER = 'https://router.discordapp.net/',
  STABLE = 'https://discord.com/',
  STABLE_OLD = 'https://discordapp.com/',
  STATUS = 'https://status.discord.com/',
  SUPPORT = 'https://support.discord.com/',
  SUPPORT_DEV = 'https://support-dev.discord.com/',
  TEMPLATE = 'https://discord.new/'
}
export const getGuildIcon = (
  guildId: string,
  hash: string,
  format: string = 'png'
): string => `${Urls.CDN}icons/${guildId}/${hash}.${format}`;
export async function apiping(): Promise<{ gateway: number; rest: number }> {
  return {
    gateway: await latency(discord.getBotUser),
    rest: await latency(discord.getGuild)
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
export function replace(
  path: string,
  parameters: Record<string, any> = {},
  enc: boolean = true
): string {
  return path.replace(PathReplacementRegexp, (match: string, key: string) => {
    if (key in parameters) {
      return enc
        ? encodeURIComponent(String(parameters[key]))
        : String(parameters[key]);
    }
    return match;
  });
}

export function createColorUrl(color: number, size: number = 100): string {
  return replace(
    NotSoPylon.Api.URL_PUBLIC +
      NotSoPylon.Api.PATH +
      NotSoPylon.Api.IMAGE_CREATE_COLOR_HEX,
    {
      format: 'png',
      height: size,
      hex: intToHex(color),
      width: size
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
  if (typeof permissions !== 'number' && typeof permissions !== 'bigint') {
    throw new Error('Permissions has to be an integer');
  }

  permissions = BigInt(permissions);
  switch (typeof check) {
    case 'bigint': {
      return (permissions & check) === check;
    }
    case 'number': {
      return checkPermissions(permissions, BigInt(check));
    }
    case 'object':
      {
        if (Array.isArray(check)) {
          return check.every((value) => checkPermissions(permissions, value));
        }
      }
      break;
    case 'string': {
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
    'Only a string, integer, or an array of strings/integers are allowed to check with.'
  );
}
export function permissionsToObject(
  permissions: bigint | number
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (let check of Object.values<PermissionChecks>(Permissions)) {
    if (check === Permissions.NONE) {
      continue;
    }
    result[String(check)] = checkPermissions(permissions, check);
  }
  return result;
}
export function getFileExtension(
  file: discord.Message.IMessageAttachment
): string {
  const filename = file.filename.split('.');
  if (filename.length) {
    return filename.pop() || '';
  }
  return '';
}
export function splitTextToDiscordHandle(
  text: string
): [string, string | null] {
  const parts = text.split('#');
  const username = (parts.shift() as string).slice(0, 32).toLowerCase();
  let discriminator: null | string = null;
  if (parts.length) {
    discriminator = (parts.shift() as string).padStart(4, '0');
  }
  return [username, discriminator];
}

export async function getMemberJoinPosition(
  guild: discord.Guild,
  userId: string
): Promise<[number, number]> {
  let members: Array<discord.GuildMember>;
  {
    members = (await asyncIteratorToArray(guild.iterMembers())).sort(
      (x, y) => +new Date(x.joinedAt) - +new Date(y.joinedAt)
    );
  }
  const joinPosition = members.findIndex((m) => m.user.id === userId) + 1;
  return [joinPosition, guild.memberCount];
}
export function toUrlParams(obj: object) {
  return `?${Object.entries(obj)
    .filter((v) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')}`;
}
export function splitTextByAmount(
  text: string,
  amount: number,
  character = '\n'
): Array<string> {
  const parts: Array<string> = [];

  if (character) {
    const split = text.split(character);
    if (split.length === 1) {
      return split;
    }
    while (split.length) {
      let newText: string = '';
      while (newText.length < amount && split.length) {
        const part = split.shift()!;
        if (part) {
          if (amount < newText.length + part.length + 2) {
            split.unshift(part);
            break;
          }
          newText += part + '\n';
        }
      }
      parts.push(newText);
    }
  } else {
    while (text.length) {
      parts.push(text.slice(0, amount));
      text = text.slice(amount);
    }
  }
  return parts;
}
export async function createTagEmbed(message: discord.Message, tag: Tag) {
  const embed = createUserEmbed(message.author);
  embed.setTitle(`Showing tag ${tag.name}`);
  embed.setColor(EmbedColors.DEFAULT);
  embed.setFooter({
    text: `Tag created by ${(await discord.getUser(tag.userId))!.getTag()}`,
    iconUrl: EmbedBrands.NOTSOBOT
  });
  embed.setThumbnail({ url: TagEmbedThumbnails['show'] });
  embed.setDescription(codeblock(tag.content.slice(0, 500)));
  return embed;
}
