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
export enum Locales {
  BULGARIAN = "bg",
  CHINESE = "zh-CN",
  CHINESE_TAIWAN = "zh-TW",
  CROATIAN = "hr",
  CZECH = "cs",
  DANISH = "da",
  DUTCH = "nl",
  ENGLISH_GB = "en-GB",
  ENGLISH_US = "en-US",
  FINNISH = "fi",
  FRENCH = "fr",
  GERMAN = "de",
  GREEK = "el",
  HUNGARIAN = "hu",
  ITALIAN = "it",
  JAPANESE = "ja",
  KOREAN = "ko",
  LITHUANIAN = "lt",
  NORWEGIAN = "no",
  POLISH = "pl",
  PORTUGUESE_BRAZILIAN = "pt-BR",
  ROMANIAN = "ro",
  RUSSIAN = "ru",
  SPANISH = "es-ES",
  SWEDISH = "sv-SE",
  THAI = "th",
  TURKISH = "tr",
  UKRAINIAN = "uk",
  VIETNAMESE = "vi",
}

export const LocalesText = {
  [Locales.BULGARIAN]: "Bulgarian",
  [Locales.CHINESE]: "Chinese, China",
  [Locales.CHINESE_TAIWAN]: "Chinese, Taiwan",
  [Locales.CROATIAN]: "Croatian",
  [Locales.CZECH]: "Czech",
  [Locales.DANISH]: "Danish",
  [Locales.DUTCH]: "Dutch",
  [Locales.ENGLISH_GB]: "English, UK",
  [Locales.ENGLISH_US]: "English, US",
  [Locales.FINNISH]: "Finnish",
  [Locales.FRENCH]: "French",
  [Locales.GERMAN]: "German",
  [Locales.GREEK]: "Greek",
  [Locales.HUNGARIAN]: "Hungarian",
  [Locales.ITALIAN]: "Italian",
  [Locales.JAPANESE]: "Japanese",
  [Locales.KOREAN]: "Korean",
  [Locales.LITHUANIAN]: "Lithuanian",
  [Locales.NORWEGIAN]: "Norwegian",
  [Locales.POLISH]: "Polish",
  [Locales.PORTUGUESE_BRAZILIAN]: "Portuguese, Brazilian",
  [Locales.ROMANIAN]: "Romanian",
  [Locales.RUSSIAN]: "Russian",
  [Locales.SPANISH]: "Spanish",
  [Locales.SWEDISH]: "Swedish",
  [Locales.THAI]: "Thai",
  [Locales.TURKISH]: "Turkish",
  [Locales.UKRAINIAN]: "Ukrainian",
  [Locales.VIETNAMESE]: "Vietnamese",
};
export enum GuildExplicitContentFilterTypes {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export const GuildExplicitContentFilterTypeTexts: Record<
  GuildExplicitContentFilterTypes,
  string
> = {
  [GuildExplicitContentFilterTypes.DISABLED]: "Disabled",
  [GuildExplicitContentFilterTypes.MEMBERS_WITHOUT_ROLES]: "No Roles",
  [GuildExplicitContentFilterTypes.ALL_MEMBERS]: "Everyone",
};

export enum VerificationLevels {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export const VerificationLevelTexts: Record<VerificationLevels, string> = {
  [VerificationLevels.NONE]: "None",
  [VerificationLevels.LOW]: "Low",
  [VerificationLevels.MEDIUM]: "Medium",
  [VerificationLevels.HIGH]: "High",
  [VerificationLevels.VERY_HIGH]: "Very High",
};

export const MAX_ACTION_ROW_BUTTONS = 5;
export const MAX_ACTION_ROW_SELECT_MENUS = 1;
export const MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024;
export const MAX_ATTACHMENT_SIZE_PREMIUM = 50 * 1024 * 1024;
export const MAX_BITRATE = 96000;
export const MAX_EMOJI_SIZE = 256000;
export const MAX_EMOJI_SLOTS = 50;
export const MAX_EMOJI_SLOTS_MORE = 200;
export const MIN_BITRATE = 8000;
export enum PremiumGuildTiers {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export const PremiumGuildTierNames = {
  [PremiumGuildTiers.NONE]: "No Level",
  [PremiumGuildTiers.TIER_1]: "Level 1",
  [PremiumGuildTiers.TIER_2]: "Level 2",
  [PremiumGuildTiers.TIER_3]: "Level 3",
};
export const PremiumGuildLimits = {
  [PremiumGuildTiers.NONE]: {
    attachment: MAX_ATTACHMENT_SIZE,
    bitrate: MAX_BITRATE,
    emoji: MAX_EMOJI_SLOTS,
  },
  [PremiumGuildTiers.TIER_1]: {
    attachment: MAX_ATTACHMENT_SIZE,
    bitrate: 128000,
    emoji: 100,
  },
  [PremiumGuildTiers.TIER_2]: {
    attachment: MAX_ATTACHMENT_SIZE_PREMIUM,
    bitrate: 256000,
    emoji: 150,
  },
  [PremiumGuildTiers.TIER_3]: {
    attachment: MAX_ATTACHMENT_SIZE_PREMIUM * 2,
    bitrate: 384000,
    emoji: 250,
  },
};
export enum GuildFeature {
  ANIMATED_ICON = "ANIMATED_ICON",
  BANNER = "BANNER",
  COMMERCE = "COMMERCE",
  DISCOVERABLE = "DISCOVERABLE",
  ENABLED_DISCOVERABLE_BEFORE = "ENABLED_DISCOVERABLE_BEFORE",
  FEATURABLE = "FEATURABLE",
  INVITE_SPLASH = "INVITE_SPLASH",
  LURKABLE = "LURKABLE",
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  MEMBER_LIST_DISABLED = "MEMBER_LIST_DISABLED",
  MORE_EMOJI = "MORE_EMOJI",
  NEWS = "NEWS",
  PARTNERED = "PARTNERED",
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  PUBLIC = "PUBLIC",
  PUBLIC_DISABLED = "PUBLIC_DISABLED",
  VANITY_URL = "VANITY_URL",
  VERIFIED = "VERIFIED",
  VIP_REGIONS = "VIP_REGIONS",
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}
export const DEFAULT_MAX_MEMBERS = 250000;
export const DEFAULT_MAX_PRESENCES = 5000;
export const DEFAULT_MAX_VIDEO_CHANNEL_USERS = 25;
