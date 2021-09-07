import config from "./config";

export const commands = new discord.command.CommandGroup({
  defaultPrefix: config.prefix,
});
export enum Colors {
  BLURPLE = 7506394,
}
export const timeMap = new Map([
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
export enum ChannelTypes {
  BASE = -1,
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
}
export const ChannelTypesText: Record<ChannelTypes, string> = {
  [ChannelTypes.BASE]: "Base Channel",
  [ChannelTypes.GUILD_TEXT]: "Guild Text",
  [ChannelTypes.DM]: "Direct Message",
  [ChannelTypes.GUILD_VOICE]: "Guild Voice",
  [ChannelTypes.GROUP_DM]: "Direct Message Group",
  [ChannelTypes.GUILD_CATEGORY]: "Guild Category",
  [ChannelTypes.GUILD_NEWS]: "Guild News",
  [ChannelTypes.GUILD_STORE]: "Guild Store",
  [ChannelTypes.GUILD_NEWS_THREAD]: "Guild News Thread",
  [ChannelTypes.GUILD_PUBLIC_THREAD]: "Guild Public Thread",
  [ChannelTypes.GUILD_PRIVATE_THREAD]: "Guild Private Thread",
  [ChannelTypes.GUILD_STAGE_VOICE]: "Guild Stage Voice",
  [ChannelTypes.GUILD_DIRECTORY]: "Guild Directory",
};
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
