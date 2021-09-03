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
export enum Statuses {
  ONLINE = "online",
  DND = "dnd",
  IDLE = "idle",
  INVISIBLE = "invisible",
  OFFLINE = "offline",
}
export const PresenceStatusColors = {
  online: 4437377,
  dnd: 15746887,
  idle: 16426522,
  offline: 7634829,
};

export const PresenceStatusTexts = {
  online: "Online",
  dnd: "Do Not Disturb",
  idle: "Idle",
  offline: "Offline",
};
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
const timeMap = new Map([
  ["decade", 1000 * 60 * 60 * 24 * 365 * 10],
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 31],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
  ["second", 1000],
  ["millisecond", 1],
]);
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
