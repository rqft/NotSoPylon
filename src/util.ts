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
