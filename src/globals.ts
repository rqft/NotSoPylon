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
export { HTTPMethods } from "detritus-rest/lib/constants";

export const Package = Object.freeze({
  URL: "https://github.com/detritusjs/client-rest",
  VERSION: "0.10.4",
});

export const ApiVersion = 9;

export enum AuthTypes {
  BEARER = "BEARER",
  BOT = "BOT",
  USER = "USER",
}

export enum ActivityActionTypes {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  WATCH = 4,
  JOIN_REQUEST = 5,
}

export enum DiscordAbortCodes {
  UNKNOWN_ACCOUNT = 10001,
  UNKNOWN_APPLICATION = 10002,
  UNKNOWN_CHANNEL = 10003,
  UNKNOWN_GUILD = 10004,
  UNKNOWN_INTEGRATION = 10005,
  UNKNOWN_INVITE = 10006,
  UNKNOWN_MEMBER = 10007,
  UNKNOWN_MESSAGE = 10008,
  UNKNOWN_OVERWRITE = 10009,
  UNKNOWN_PLATFORM = 10010,
  UNKNOWN_ROLE = 10011,
  UNKNOWN_TOKEN = 10012,
  UNKNOWN_USER = 10013,
  UNKNOWN_EMOJI = 10014,
  UNKNOWN_WEBHOOK = 10015,
  UNKNOWN_GIFT_CODE = 10038,

  BOT_DISALLOWED = 20001,
  BOT_REQUIRED = 20002,
  RPC_PROXY_DISALLOWED = 20003,
  EXPLICIT_CONTENT = 20009,
  ACCOUNT_SCHEDULED_FOR_DELETION = 20011,
  USER_NOT_AUTHORIZED_FOR_APPLICATION = 20012,
  ACCOUNT_DISABLED = 20013,
  SLOWMODE_RATE_LIMITED = 20016,
  CHANNEL_FOLLOWING_EDIT_RATE_LIMITED = 20017,
  UNDER_MINIMUM_AGE = 20024,

  TOO_MANY_USER_GUILDS = 30001,
  TOO_MANY_BOT_GUILDS = 30001,
  TOO_MANY_FRIENDS = 30002,
  TOO_MANY_PINS_IN_CHANNEL = 30003,
  TOO_MANY_RECIPIENTS = 30004,
  TOO_MANY_GUILD_ROLES = 30005,
  TOO_MANY_USING_USERNAME = 30006,
  TOO_MANY_WEBHOOKS = 30007,
  TOO_MANY_EMOJI = 30008,
  TOO_MANY_REACTIONS = 30010,
  TOO_MANY_GUILD_CHANNELS = 30013,
  TOO_MANY_ATTACHMENTS = 30015,
  TOO_MANY_ANIMATED_EMOJI = 30018,
  NOT_ENOUGH_GUILD_MEMBERS = 30029,

  UNAUTHORIZED = 40001,
  EMAIL_VERIFICATION_REQUIRED = 40002,
  RATE_LIMIT_DM_OPEN = 40003,
  SEND_MESSAGE_TEMPORARILY_DISABLED = 40004,
  USER_BANNED = 40007,
  CONNECTION_REVOKED = 40012,
  DELETE_ACCOUNT_TRANSFER_TEAM_OWNERSHIP = 40028,

  INVALID_ACCESS = 50001,
  INVALID_ACCOUNT_TYPE = 50002,
  INVALID_ACTION_DM = 50003,
  INVALID_EMBED_DISABLED = 50004,
  INVALID_MESSAGE_AUTHOR = 50005,
  INVALID_MESSAGE_EMPTY = 50006,
  INVALID_MESSAGE_SEND_USER = 50007,
  INVALID_MESSAGE_SEND_NON_TEXT = 50008,
  INVALID_MESSAGE_VERIFICATION_LEVEL = 50009,
  INVALID_OAUTH_APP_BOT = 50010,
  INVALID_OAUTH_APP_LIMIT = 50011,
  INVALID_OAUTH_STATE = 50012,
  INVALID_PERMISSIONS = 50013,
  INVALID_TOKEN = 50014,
  INVALID_NOTE = 50015,
  INVALID_BULK_DELETE_COUNT = 50016,
  INVALID_MFA_LEVEL = 50017,
  INVALID_PASSWORD = 50018,
  INVALID_PIN_MESSAGE_CHANNEL = 50019,
  INVALID_INVITE_CODE = 50020,
  INVALID_SYSTEM_MESSAGE_ACTION = 50021,
  INVALID_PHONE_NUMBER = 50022,
  INVALID_CLIENT_ID = 50023,
  INVALID_CHANNEL_TYPE = 50024,
  INVALID_OAUTH2_ACCESS_TOKEN = 50025,
  INVALID_OAUTH2_MISSING_SCOPE = 50026,
  INVALID_WEBHOOK_TOKEN = 50027,
  INVALID_BULK_DELETE = 50034,
  INVALID_FORM_BODY = 50035,
  INVALID_INVITE_ACCEPTED = 50036,
  INVALID_API_VERSION = 50041,
  INVALID_FILE_SIZE = 50045,
  INVALID_FILE = 50046,
  INVALID_GIFT_REDEMPTION_EXHAUSTED = 50050,
  INVALID_GIFT_REDEMPTION_OWNED = 50051,
  INVALID_GIFT_SELF_REDEMPTION = 50054,
  INVALID_GIFT_REDEMPTION_SUBSCRIPTION_MANAGED = 100021,
  INVALID_GIFT_REDEMPTION_SUBSCRIPTION_INCOMPATIBLE = 100023,
  INVALID_GIFT_REDEMPTION_INVOICE_OPEN = 100024,

  MFA_ENABLED = 60001,
  MFA_DISABLED = 60002,
  MFA_REQUIRED = 60003,
  MFA_UNVERIFIED = 60004,
  MFA_INVALID_SECRET = 60005,
  MFA_INVALID_TICKET = 60006,
  MFA_INVALID_CODE = 60008,
  MFA_INVALID_SESSION = 60009,

  PHONE_NUMBER_UNABLE_TO_SEND = 70003,
  PHONE_VERIFICATION_REQUIRED = 70007,

  RELATIONSHIP_INCOMING_DISABLED = 80000,
  RELATIONSHIP_INCOMING_BLOCKED = 80001,
  RELATIONSHIP_INVALUD_USER_BOT = 80002,
  RELATIONSHIP_INVALID_SELF = 80003,
  RELATIONSHIP_INVALID_DISCORD_TAG = 80004,

  REACTION_BLOCKED = 90001,

  LISTING_ALREADY_JOINED = 120000,
  LISTING_TOO_MANY_MEMBERS = 120001,
  LISTING_JOIN_BLOCKED = 120002,

  RESOURCE_OVERLOADED = 130000,

  INVALID_LOTTIE = 170001,
}

export enum DiscordHeaders {
  AUDIT_LOG_REASON = "x-audit-log-reason",
  DEBUG_OPTIONS = "x-debug-options",
  FINGERPRINT = "x-fingerprint",
  SUPER_PROPERTIES = "x-super-properties",
  TRACK = "x-track",
}

export enum RatelimitHeaders {
  BUCKET = "x-ratelimit-bucket",
  GLOBAL = "x-ratelimit-global",
  LIMIT = "x-ratelimit-limit",
  PRECISION = "x-ratelimit-precision",
  REMAINING = "x-ratelimit-remaining",
  RESET = "x-ratelimit-reset",
  RESET_AFTER = "x-ratelimit-reset-after",
  RETRY_AFTER = "retry-after",
}

export enum RatelimitPrecisionTypes {
  MILLISECOND = "millisecond",
  SECOND = "second",
}

export enum RestEvents {
  REQUEST = "request",
  RESPONSE = "response",
}

export const RATELIMIT_BUCKET_MAJOR_PARAMS = Object.freeze([
  "channelId",
  "guildId",
  "webhookId",
  "webhookToken",
]);

export const SPOILER_ATTACHMENT_PREFIX = "SPOILER_";

// https://github.com/discordapp/discord-api-docs/issues/1092
// add 200 ms leeway incase our clock is wrong or the request takes too long
export const MESSAGE_DELETE_RATELIMIT_CHECK = 10 * 1000 - 200; // 10 seconds
export const MESSAGE_DELETE_RATELIMIT_CHECK_OLDER =
  2 * 7 * 24 * 60 * 60 * 1000 - 200; // 2 weeks
