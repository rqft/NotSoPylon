import config from './config';

export const commands = new discord.command.CommandGroup({
  defaultPrefix: config.prefixes[0] ?? '.',
  additionalPrefixes: config.prefixes
});
export enum Colors {
  BLURPLE = 7506394
}
export enum EmbedBrands {
  DUCK_DUCK_GO = 'https://cdn.notsobot.com/brands/duck-duck-go.png',
  E621 = 'https://cdn.notsobot.com/brands/e621.png',
  GOOGLE_CONTENT_VISION_SAFETY = 'https://cdn.notsobot.com/brands/google-content-vision-safety.png',
  GOOGLE_GO = 'https://cdn.notsobot.com/brands/google-go.png',
  NOTSOBOT = 'https://cdn.notsobot.com/brands/notsobot.png',
  REDDIT = 'https://cdn.notsobot.com/brands/reddit.png',
  RULE34 = 'https://cdn.notsobot.com/brands/rule34.png',
  RULE34_PAHEAL = 'https://cdn.notsobot.com/brands/rule34-paheal.png',
  STEAM = 'https://cdn.notsobot.com/brands/steam.png',
  URBAN = 'https://cdn.notsobot.com/brands/urban-dictionary.png',
  WIKIHOW = 'https://cdn.notsobot.com/brands/wikihow.png',
  WOLFRAM_ALPHA = 'https://cdn.notsobot.com/brands/wolfram-alpha.png',
  YOUTUBE = 'https://cdn.notsobot.com/brands/youtube.png'
}
export enum EmbedColors {
  DARK_MESSAGE_BACKGROUND = 3092790,
  DEFAULT = 8684933,
  ERROR = 15746887,
  LOG_CREATION = 4437377,
  LOG_DELETION = 15746887,
  LOG_UPDATE = 16426522,
  STEAM_IN_GAME = 9484860,
  STEAM_OFFLINE = 9013641,
  STEAM_ONLINE = 5753822
}
export const timeMap = new Map([
  ['decade', 1000 * 60 * 60 * 24 * 365 * 10],
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 31],
  ['week', 1000 * 60 * 60 * 24 * 7],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
  ['second', 1000],
  ['millisecond', 1]
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
  GUILD_DIRECTORY = 14
}
export const ChannelTypesText: Record<ChannelTypes, string> = {
  [ChannelTypes.BASE]: 'Base Channel',
  [ChannelTypes.GUILD_TEXT]: 'Guild Text',
  [ChannelTypes.DM]: 'Direct Message',
  [ChannelTypes.GUILD_VOICE]: 'Guild Voice',
  [ChannelTypes.GROUP_DM]: 'Direct Message Group',
  [ChannelTypes.GUILD_CATEGORY]: 'Guild Category',
  [ChannelTypes.GUILD_NEWS]: 'Guild News',
  [ChannelTypes.GUILD_STORE]: 'Guild Store',
  [ChannelTypes.GUILD_NEWS_THREAD]: 'Guild News Thread',
  [ChannelTypes.GUILD_PUBLIC_THREAD]: 'Guild Public Thread',
  [ChannelTypes.GUILD_PRIVATE_THREAD]: 'Guild Private Thread',
  [ChannelTypes.GUILD_STAGE_VOICE]: 'Guild Stage Voice',
  [ChannelTypes.GUILD_DIRECTORY]: 'Guild Directory'
};
export enum Statuses {
  ONLINE = 'online',
  DND = 'dnd',
  IDLE = 'idle',
  INVISIBLE = 'invisible',
  OFFLINE = 'offline'
}
export const PresenceStatusColors = {
  online: 4437377,
  dnd: 15746887,
  idle: 16426522,
  offline: 7634829
};

export const PresenceStatusTexts: Record<Statuses, string> = {
  online: 'Online',
  dnd: 'Busy',
  idle: 'Idle',
  offline: 'Offline',
  invisible: 'Invisible'
};
export enum Locales {
  BULGARIAN = 'bg',
  CHINESE = 'zh-CN',
  CHINESE_TAIWAN = 'zh-TW',
  CROATIAN = 'hr',
  CZECH = 'cs',
  DANISH = 'da',
  DUTCH = 'nl',
  ENGLISH_GB = 'en-GB',
  ENGLISH_US = 'en-US',
  FINNISH = 'fi',
  FRENCH = 'fr',
  GERMAN = 'de',
  GERMAN_DE = 'de-DE',
  GREEK = 'el',
  HUNGARIAN = 'hu',
  ITALIAN = 'it',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  LITHUANIAN = 'lt',
  NORWEGIAN = 'no',
  POLISH = 'pl',
  PORTUGUESE_BRAZILIAN = 'pt-BR',
  ROMANIAN = 'ro',
  RUSSIAN = 'ru',
  SPANISH = 'es-ES',
  SWEDISH = 'sv-SE',
  THAI = 'th',
  TURKISH = 'tr',
  UKRAINIAN = 'uk',
  VIETNAMESE = 'vi'
}

export const LocalesText = {
  [Locales.BULGARIAN]: 'Bulgarian',
  [Locales.CHINESE]: 'Chinese, China',
  [Locales.CHINESE_TAIWAN]: 'Chinese, Taiwan',
  [Locales.CROATIAN]: 'Croatian',
  [Locales.CZECH]: 'Czech',
  [Locales.DANISH]: 'Danish',
  [Locales.DUTCH]: 'Dutch',
  [Locales.ENGLISH_GB]: 'English, UK',
  [Locales.ENGLISH_US]: 'English, US',
  [Locales.FINNISH]: 'Finnish',
  [Locales.FRENCH]: 'French',
  [Locales.GERMAN]: 'German',
  [Locales.GERMAN_DE]: 'German',
  [Locales.GREEK]: 'Greek',
  [Locales.HUNGARIAN]: 'Hungarian',
  [Locales.ITALIAN]: 'Italian',
  [Locales.JAPANESE]: 'Japanese',
  [Locales.KOREAN]: 'Korean',
  [Locales.LITHUANIAN]: 'Lithuanian',
  [Locales.NORWEGIAN]: 'Norwegian',
  [Locales.POLISH]: 'Polish',
  [Locales.PORTUGUESE_BRAZILIAN]: 'Portuguese, Brazilian',
  [Locales.ROMANIAN]: 'Romanian',
  [Locales.RUSSIAN]: 'Russian',
  [Locales.SPANISH]: 'Spanish',
  [Locales.SWEDISH]: 'Swedish',
  [Locales.THAI]: 'Thai',
  [Locales.TURKISH]: 'Turkish',
  [Locales.UKRAINIAN]: 'Ukrainian',
  [Locales.VIETNAMESE]: 'Vietnamese'
};
export enum GuildExplicitContentFilterTypes {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2
}

export const GuildExplicitContentFilterTypeTexts: Record<
  GuildExplicitContentFilterTypes,
  string
> = {
  [GuildExplicitContentFilterTypes.DISABLED]: 'Disabled',
  [GuildExplicitContentFilterTypes.MEMBERS_WITHOUT_ROLES]: 'No Roles',
  [GuildExplicitContentFilterTypes.ALL_MEMBERS]: 'Everyone'
};

export enum VerificationLevels {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4
}

export const VerificationLevelTexts: Record<VerificationLevels, string> = {
  [VerificationLevels.NONE]: 'None',
  [VerificationLevels.LOW]: 'Low',
  [VerificationLevels.MEDIUM]: 'Medium',
  [VerificationLevels.HIGH]: 'High',
  [VerificationLevels.VERY_HIGH]: 'Very High'
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
  TIER_3 = 3
}

export const PremiumGuildTierNames = {
  [PremiumGuildTiers.NONE]: 'No Level',
  [PremiumGuildTiers.TIER_1]: 'Level 1',
  [PremiumGuildTiers.TIER_2]: 'Level 2',
  [PremiumGuildTiers.TIER_3]: 'Level 3'
};
export const PremiumGuildLimits = {
  [PremiumGuildTiers.NONE]: {
    attachment: MAX_ATTACHMENT_SIZE,
    bitrate: MAX_BITRATE,
    emoji: MAX_EMOJI_SLOTS
  },
  [PremiumGuildTiers.TIER_1]: {
    attachment: MAX_ATTACHMENT_SIZE,
    bitrate: 128000,
    emoji: 100
  },
  [PremiumGuildTiers.TIER_2]: {
    attachment: MAX_ATTACHMENT_SIZE_PREMIUM,
    bitrate: 256000,
    emoji: 150
  },
  [PremiumGuildTiers.TIER_3]: {
    attachment: MAX_ATTACHMENT_SIZE_PREMIUM * 2,
    bitrate: 384000,
    emoji: 250
  }
};
export enum GuildFeature {
  ANIMATED_ICON = 'ANIMATED_ICON',
  BANNER = 'BANNER',
  COMMERCE = 'COMMERCE',
  DISCOVERABLE = 'DISCOVERABLE',
  ENABLED_DISCOVERABLE_BEFORE = 'ENABLED_DISCOVERABLE_BEFORE',
  FEATURABLE = 'FEATURABLE',
  INVITE_SPLASH = 'INVITE_SPLASH',
  LURKABLE = 'LURKABLE',
  MEMBER_VERIFICATION_GATE_ENABLED = 'MEMBER_VERIFICATION_GATE_ENABLED',
  MEMBER_LIST_DISABLED = 'MEMBER_LIST_DISABLED',
  MORE_EMOJI = 'MORE_EMOJI',
  NEWS = 'NEWS',
  PARTNERED = 'PARTNERED',
  PREVIEW_ENABLED = 'PREVIEW_ENABLED',
  PUBLIC = 'PUBLIC',
  PUBLIC_DISABLED = 'PUBLIC_DISABLED',
  VANITY_URL = 'VANITY_URL',
  VERIFIED = 'VERIFIED',
  VIP_REGIONS = 'VIP_REGIONS',
  WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED'
}
export const DEFAULT_MAX_MEMBERS = 250000;
export const DEFAULT_MAX_PRESENCES = 5000;
export const DEFAULT_MAX_VIDEO_CHANNEL_USERS = 25;

export const Package = Object.freeze({
  URL: 'https://github.com/detritusjs/client-rest',
  VERSION: '0.10.4'
});

export const ApiVersion = 9;

export enum AuthTypes {
  BEARER = 'BEARER',
  BOT = 'BOT',
  USER = 'USER'
}

export enum ActivityActionTypes {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  WATCH = 4,
  JOIN_REQUEST = 5
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

  INVALID_LOTTIE = 170001
}

export enum DiscordHeaders {
  AUDIT_LOG_REASON = 'x-audit-log-reason',
  DEBUG_OPTIONS = 'x-debug-options',
  FINGERPRINT = 'x-fingerprint',
  SUPER_PROPERTIES = 'x-super-properties',
  TRACK = 'x-track'
}

export enum RatelimitHeaders {
  BUCKET = 'x-ratelimit-bucket',
  GLOBAL = 'x-ratelimit-global',
  LIMIT = 'x-ratelimit-limit',
  PRECISION = 'x-ratelimit-precision',
  REMAINING = 'x-ratelimit-remaining',
  RESET = 'x-ratelimit-reset',
  RESET_AFTER = 'x-ratelimit-reset-after',
  RETRY_AFTER = 'retry-after'
}

export enum RatelimitPrecisionTypes {
  MILLISECOND = 'millisecond',
  SECOND = 'second'
}

export enum RestEvents {
  REQUEST = 'request',
  RESPONSE = 'response'
}

export const RATELIMIT_BUCKET_MAJOR_PARAMS = Object.freeze([
  'channelId',
  'guildId',
  'webhookId',
  'webhookToken'
]);

export const SPOILER_ATTACHMENT_PREFIX = 'SPOILER_';

// https://github.com/discordapp/discord-api-docs/issues/1092
// add 200 ms leeway incase our clock is wrong or the request takes too long
export const MESSAGE_DELETE_RATELIMIT_CHECK = 10 * 1000 - 200; // 10 seconds
export const MESSAGE_DELETE_RATELIMIT_CHECK_OLDER =
  2 * 7 * 24 * 60 * 60 * 1000 - 200; // 2 weeks
export interface DiscordRegexMatch {
  animated?: boolean;
  channelId?: string;
  guildId?: string;
  id?: string;
  language?: string;
  matched: string;
  mentionType?: string;
  messageId?: string;
  name?: string;
  text?: string;
}

export interface DiscordRegexPayload {
  match: {
    regex: RegExp;
    type: string;
  };
  matches: Array<DiscordRegexMatch>;
}

export function regex(
  type: string,
  content: string,
  onlyFirst: boolean = false
): DiscordRegexPayload {
  type = String(type || '').toUpperCase();
  const regex = (DiscordRegex as any)[type];
  if (regex === undefined) {
    throw new Error(`Unknown regex type: ${type}`);
  }
  regex.lastIndex = 0;

  const payload: DiscordRegexPayload = {
    match: { regex, type },
    matches: []
  };

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(content))) {
    const result: DiscordRegexMatch = { matched: match[0] };
    switch (type) {
      case DiscordRegexNames.EMOJI:
        {
          result.name = match[1] as string;
          result.id = match[2] as string;
          result.animated = content.startsWith('<a:');
        }
        break;
      case DiscordRegexNames.JUMP_CHANNEL:
        {
          result.guildId = match[1] as string;
          result.channelId = match[2] as string;
        }
        break;
      case DiscordRegexNames.JUMP_CHANNEL_MESSAGE:
        {
          result.guildId = match[1] as string;
          result.channelId = match[2] as string;
          result.messageId = match[3] as string;
        }
        break;
      case DiscordRegexNames.MENTION_CHANNEL:
      case DiscordRegexNames.MENTION_ROLE:
        {
          result.id = match[1] as string;
        }
        break;
      case DiscordRegexNames.MENTION_USER:
        {
          result.id = match[2] as string;
          result.mentionType = match[1] as string;
        }
        break;
      case DiscordRegexNames.TEXT_CODEBLOCK:
        {
          result.language = match[2] as string;
          result.text = match[3] as string;
        }
        break;
      case DiscordRegexNames.TEXT_BOLD:
      case DiscordRegexNames.TEXT_CODESTRING:
      case DiscordRegexNames.TEXT_ITALICS:
      case DiscordRegexNames.TEXT_SNOWFLAKE:
      case DiscordRegexNames.TEXT_SPOILER:
      case DiscordRegexNames.TEXT_STRIKE:
      case DiscordRegexNames.TEXT_UNDERLINE:
      case DiscordRegexNames.TEXT_URL:
        {
          result.text = match[1] as string;
        }
        break;
      default: {
        throw new Error(`Unknown regex type: ${type}`);
      }
    }
    payload.matches.push(result);

    if (onlyFirst) {
      break;
    }
  }
  regex.lastIndex = 0;
  return payload;
}
export enum DiscordRegexNames {
  EMOJI = 'EMOJI',
  JUMP_CHANNEL = 'JUMP_CHANNEL',
  JUMP_CHANNEL_MESSAGE = 'JUMP_CHANNEL_MESSAGE',
  MENTION_CHANNEL = 'MENTION_CHANNEL',
  MENTION_ROLE = 'MENTION_ROLE',
  MENTION_USER = 'MENTION_USER',
  TEXT_BOLD = 'TEXT_BOLD',
  TEXT_CODEBLOCK = 'TEXT_CODEBLOCK',
  TEXT_CODESTRING = 'TEXT_CODESTRING',
  TEXT_ITALICS = 'TEXT_ITALICS',
  TEXT_SNOWFLAKE = 'TEXT_SNOWFLAKE',
  TEXT_SPOILER = 'TEXT_SPOILER',
  TEXT_STRIKE = 'TEXT_STRIKE',
  TEXT_UNDERLINE = 'TEXT_UNDERLINE',
  TEXT_URL = 'TEXT_URL'
}

export const DiscordRegex = Object.freeze({
  [DiscordRegexNames.EMOJI]: /<a?:(\w+):(\d+)>/g,
  [DiscordRegexNames.JUMP_CHANNEL]: /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)$/g,
  [DiscordRegexNames.JUMP_CHANNEL_MESSAGE]: /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)\/(\d+)$/g,
  [DiscordRegexNames.MENTION_CHANNEL]: /<#(\d+)>/g,
  [DiscordRegexNames.MENTION_ROLE]: /<@&(\d+)>/g,
  [DiscordRegexNames.MENTION_USER]: /<@(!?)(\d+)>/g,
  [DiscordRegexNames.TEXT_BOLD]: /\*\*([\s\S]+?)\*\*/g,
  [DiscordRegexNames.TEXT_CODEBLOCK]: /```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/gi,
  [DiscordRegexNames.TEXT_CODESTRING]: /`([\s\S]+?)`/g,
  [DiscordRegexNames.TEXT_ITALICS]: /_([\s\S]+?)_|\*([\s\S]+?)\*/g,
  [DiscordRegexNames.TEXT_SNOWFLAKE]: /(\d+)/g,
  [DiscordRegexNames.TEXT_SPOILER]: /\|\|([\s\S]+?)\|\|/g,
  [DiscordRegexNames.TEXT_STRIKE]: /~~([\s\S]+?)~~(?!_)/g,
  [DiscordRegexNames.TEXT_UNDERLINE]: /__([\s\S]+?)__/g,
  [DiscordRegexNames.TEXT_URL]: /((?:https?):\/\/[^\s<]+[^<.,:;"'\]\s])/g
});

export const DateOptions = {
  timeZone: config.timezone
};
export const Permissions = Object.freeze({
  NONE: 0n,
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_ANALYTICS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  CHANGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_EMOJIS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  USE_PUBLIC_THREADS: 1n << 35n,
  USE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n
});

export const PERMISSIONS_ALL = Object.values(Permissions).reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_ALL_TEXT = [
  Permissions.ADD_REACTIONS,
  Permissions.SEND_MESSAGES,
  Permissions.SEND_TTS_MESSAGES,
  Permissions.MANAGE_MESSAGES,
  Permissions.EMBED_LINKS,
  Permissions.ATTACH_FILES,
  Permissions.READ_MESSAGE_HISTORY,
  Permissions.MENTION_EVERYONE,
  Permissions.USE_EXTERNAL_EMOJIS,
  Permissions.USE_APPLICATION_COMMANDS,
  Permissions.MANAGE_THREADS,
  Permissions.USE_PUBLIC_THREADS,
  Permissions.USE_PRIVATE_THREADS
].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_ALL_VOICE = [
  Permissions.PRIORITY_SPEAKER,
  Permissions.STREAM,
  Permissions.CONNECT,
  Permissions.SPEAK,
  Permissions.MUTE_MEMBERS,
  Permissions.DEAFEN_MEMBERS,
  Permissions.MOVE_MEMBERS,
  Permissions.USE_VAD,
  Permissions.REQUEST_TO_SPEAK
].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_DEFAULT = [
  Permissions.CREATE_INSTANT_INVITE,
  Permissions.CHANGE_NICKNAME,
  Permissions.VIEW_CHANNEL,

  Permissions.ADD_REACTIONS,
  Permissions.SEND_MESSAGES,
  Permissions.SEND_TTS_MESSAGES,
  Permissions.EMBED_LINKS,
  Permissions.ATTACH_FILES,
  Permissions.READ_MESSAGE_HISTORY,
  Permissions.MENTION_EVERYONE,
  Permissions.USE_EXTERNAL_EMOJIS,

  Permissions.STREAM,
  Permissions.CONNECT,
  Permissions.SPEAK,
  Permissions.USE_VAD
].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_LURKER = [
  Permissions.VIEW_CHANNEL,
  Permissions.READ_MESSAGE_HISTORY
].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_FOR_GUILD = [Permissions.ADMINISTRATOR].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_FOR_CHANNEL_TEXT = [Permissions.ADMINISTRATOR].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);

export const PERMISSIONS_FOR_CHANNEL_VOICE = [Permissions.ADMINISTRATOR].reduce(
  (permissions: bigint, permission: bigint) => permissions | permission,
  Permissions.NONE
);
export const PERMISSIONS_ADMIN = Object.freeze([
  Permissions.ADMINISTRATOR,
  Permissions.BAN_MEMBERS,
  Permissions.CHANGE_NICKNAMES,
  Permissions.KICK_MEMBERS,
  Permissions.MANAGE_CHANNELS,
  Permissions.MANAGE_EMOJIS,
  Permissions.MANAGE_GUILD,
  Permissions.MANAGE_MESSAGES,
  Permissions.MANAGE_ROLES,
  Permissions.MANAGE_THREADS,
  Permissions.MANAGE_WEBHOOKS,
  Permissions.VIEW_AUDIT_LOG,
  Permissions.VIEW_GUILD_ANALYTICS
]);

export const PERMISSIONS_TEXT = Object.freeze([
  Permissions.ADD_REACTIONS,
  Permissions.ATTACH_FILES,
  Permissions.CREATE_INSTANT_INVITE,
  Permissions.EMBED_LINKS,
  Permissions.MENTION_EVERYONE,
  Permissions.READ_MESSAGE_HISTORY,
  Permissions.SEND_MESSAGES,
  Permissions.SEND_TTS_MESSAGES,
  Permissions.USE_APPLICATION_COMMANDS,
  Permissions.USE_EXTERNAL_EMOJIS,
  Permissions.USE_PRIVATE_THREADS,
  Permissions.USE_PUBLIC_THREADS,
  Permissions.VIEW_CHANNEL
]);

export const PERMISSIONS_VOICE = Object.freeze([
  Permissions.CONNECT,
  Permissions.CREATE_INSTANT_INVITE,
  Permissions.DEAFEN_MEMBERS,
  Permissions.MOVE_MEMBERS,
  Permissions.MUTE_MEMBERS,
  Permissions.PRIORITY_SPEAKER,
  Permissions.REQUEST_TO_SPEAK,
  Permissions.SPEAK,
  Permissions.STREAM,
  Permissions.USE_VAD,
  Permissions.VIEW_CHANNEL
]);

export const PermissionsText = Object.freeze({
  [String(Permissions.ADD_REACTIONS)]: 'Add Reactions',
  [String(Permissions.ADMINISTRATOR)]: 'Administrator',
  [String(Permissions.ATTACH_FILES)]: 'Attach Files',
  [String(Permissions.BAN_MEMBERS)]: 'Ban Members',
  [String(Permissions.CHANGE_NICKNAME)]: 'Change Nickname',
  [String(Permissions.CHANGE_NICKNAMES)]: 'Change Nicknames',
  [String(Permissions.CONNECT)]: 'Connect',
  [String(Permissions.CREATE_INSTANT_INVITE)]: 'Create Instant Invite',
  [String(Permissions.DEAFEN_MEMBERS)]: 'Deafen Members',
  [String(Permissions.EMBED_LINKS)]: 'Embed Links',
  [String(Permissions.KICK_MEMBERS)]: 'Kick Members',
  [String(Permissions.MANAGE_CHANNELS)]: 'Manage Channels',
  [String(Permissions.MANAGE_EMOJIS)]: 'Manage Emojis',
  [String(Permissions.MANAGE_GUILD)]: 'Manage Guild',
  [String(Permissions.MANAGE_MESSAGES)]: 'Manage Messages',
  [String(Permissions.MANAGE_ROLES)]: 'Manage Roles',
  [String(Permissions.MANAGE_THREADS)]: 'Manage Threads',
  [String(Permissions.MANAGE_WEBHOOKS)]: 'Manage Webhooks',
  [String(Permissions.MENTION_EVERYONE)]: 'Mention Everyone',
  [String(Permissions.MOVE_MEMBERS)]: 'Move Members',
  [String(Permissions.MUTE_MEMBERS)]: 'Mute Members',
  [String(Permissions.NONE)]: 'None',
  [String(Permissions.PRIORITY_SPEAKER)]: 'Priority Speaker',
  [String(Permissions.READ_MESSAGE_HISTORY)]: 'Read Message History',
  [String(Permissions.REQUEST_TO_SPEAK)]: 'Request To Speak',
  [String(Permissions.SEND_MESSAGES)]: 'Send Messages',
  [String(Permissions.SEND_TTS_MESSAGES)]: 'Text-To-Speech',
  [String(Permissions.SPEAK)]: 'Speak',
  [String(Permissions.STREAM)]: 'Go Live',
  [String(Permissions.USE_APPLICATION_COMMANDS)]: 'Use Slash Commands',
  [String(Permissions.USE_EXTERNAL_EMOJIS)]: 'Use External Emojis',
  [String(Permissions.USE_PRIVATE_THREADS)]: 'Use Private Threads',
  [String(Permissions.USE_PUBLIC_THREADS)]: 'Use Public Threads',
  [String(Permissions.USE_VAD)]: 'Voice Auto Detect',
  [String(Permissions.VIEW_AUDIT_LOG)]: 'View Audit Logs',
  [String(Permissions.VIEW_CHANNEL)]: 'View Channel',
  [String(Permissions.VIEW_GUILD_ANALYTICS)]: 'View Guild Analytics'
});
export enum BooleanEmojis {
  NO = '❌',
  YES = '✅'
}
export enum MessageEmbedTypes {
  APPLICATION_NEWS = 'application_news',
  ARTICLE = 'article',
  GIFV = 'gifv',
  IMAGE = 'image',
  LINK = 'link',
  RICH = 'rich',
  TWEET = 'tweet',
  VIDEO = 'video'
}
export const TRUSTED_URLS = [
  'cdn.discordapp.com',
  'images-ext-1.discordapp.net',
  'images-ext-2.discordapp.net',
  'media.discordapp.net'
];
export const EmbeddableRegexes = Object.freeze({
  audio: /mp3|ogg|wav|flac/i,
  image: /png|jpe?g|webp|gif/i,
  video: /mp4|webm|mov/i
});
export enum Timezones {
  MIT = 'Pacific/Midway',
  HST = 'Us/Hawaii',
  AST = 'US/Alaska',
  PST = 'US/Pacific',
  PNT = 'America/Phoenix',
  MST = 'US/Mountain',
  CST = 'US/Central',
  EST = 'US/Eastern',
  IET = 'US/East-Indiana',
  PRT = 'Etc/GMT-4',
  CNT = 'Canada/Newfoundland',
  AGT = 'Etc/GMT-3',
  BET = 'Brazil/East',
  CAT = 'Etc/GMT-1',
  GMT = 'GMT',
  ECT = 'Etc/GMT+1',
  EET = 'EET',
  ART = 'Egypt',
  EAT = 'Etc/GMT+3',
  MET = 'MET',
  NET = 'Etc/GMT+4',
  PLT = 'Etc/GMT+5',
  IST = 'Etc/GMT+5:30',
  BST = 'Etc/GMT+6',
  VST = 'Etc/GMT+7',
  CTT = 'Etc/GMT+8',
  JST = 'Japan',
  ACT = 'Australia/ACT',
  AET = 'Etc/GMT+10',
  SST = 'Etc/GMT+11',
  NST = 'Etc/GMT+12'
}
export const colorStrings: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  alegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};
export enum GoogleLocales {
  AFRIKAANS = 'af',
  ALBANIAN = 'sq',
  AMHARIC = 'am',
  ARABIC = 'ar',
  ARMENIAN = 'hy',
  AZERBAIJANI = 'az',
  BASQUE = 'eu',
  BELARUSIAN = 'be',
  BENGALI = 'bn',
  BOSNIAN = 'bs',
  BULGARIAN = 'bg',
  CATALAN = 'ca',
  CEBUANO = 'ceb',
  CHINESE_SIMPLIFIED = 'zh-CN',
  CHINESE_TRADITIONAL = 'zh-TW',
  CORSICAN = 'co',
  CROATIAN = 'hr',
  CZECH = 'cs',
  DANISH = 'da',
  DUTCH = 'nl',
  ENGLISH = 'en',
  ESPERANTO = 'eo',
  ESTONIAN = 'et',
  FILIPINO = 'fil',
  FINNISH = 'fi',
  FRENCH = 'fr',
  FRISIAN = 'fy',
  GALICIAN = 'gl',
  GEORGIAN = 'ka',
  GERMAN = 'de',
  GREEK = 'el',
  GUJARATI = 'gu',
  HAITIAN_CREOLE = 'ht',
  HAUSA = 'ha',
  HAWAIIAN = 'haw',
  HEBREW = 'iw',
  HINDI = 'hi',
  HMONG = 'hmn',
  HUNGARIAN = 'hu',
  ICELANDIC = 'is',
  IGBO = 'ig',
  INDONESIAN = 'id',
  IRISH = 'ga',
  ITALIAN = 'it',
  JAPANESE = 'ja',
  JAVANESE = 'jw',
  KANNADA = 'kn',
  KAZAKH = 'kk',
  KHMER = 'km',
  KOREAN = 'ko',
  KURDISH = 'ku',
  KYRGYZ = 'ky',
  LAO = 'lo',
  LATIN = 'la',
  LATVIAN = 'lv',
  LITHUANIAN = 'lt',
  LUXEMBOURGISH = 'lb',
  MACEDONIAN = 'mk',
  MALAGASY = 'mg',
  MALAY = 'ms',
  MALAYALAM = 'ml',
  MALTESE = 'mt',
  MAORI = 'mi',
  MARATHI = 'mr',
  MONGOLIAN = 'mn',
  MYANMAR_BURMESE = 'my',
  NEPALI = 'ne',
  NORWEGIAN = 'no',
  NYANJA_CHICHEWA = 'ny',
  PASHTO = 'ps',
  PERSIAN = 'fa',
  POLISH = 'pl',
  PORTUGUESE_BRAZIL = 'pt-BR',
  PORTUGUESE_PORTUGAL = 'pt-PT',
  PUNJABI = 'pa',
  ROMANIAN = 'ro',
  RUSSIAN = 'ru',
  SAMOAN = 'sm',
  SCOTS_GAELIC = 'gd',
  SERBIAN = 'sr',
  SESOTHO = 'st',
  SHONA = 'sn',
  SINDHI = 'sd',
  SINHALA_SINHALESE = 'si',
  SLOVAK = 'sk',
  SLOVENIAN = 'sl',
  SOMALI = 'so',
  SPANISH = 'es',
  SUNDANESE = 'su',
  SWAHILI = 'sw',
  SWEDISH = 'sv',
  TAGALOG_FILIPINO = 'tl',
  TAJIK = 'tg',
  TAMIL = 'ta',
  TELUGU = 'te',
  THAI = 'th',
  TURKISH = 'tr',
  UKRAINIAN = 'uk',
  URDU = 'ur',
  UZBEK = 'uz',
  VIETNAMESE = 'vi',
  WELSH = 'cy',
  XHOSA = 'xh',
  YIDDISH = 'yi',
  YORUBA = 'yo',
  ZULU = 'zu'
}

export const GOOGLE_LOCALES = Object.freeze(Object.values(GoogleLocales));

export const GoogleLocalesText: Record<GoogleLocales, string> = Object.freeze({
  [GoogleLocales.AFRIKAANS]: 'Afrikaans',
  [GoogleLocales.ALBANIAN]: 'Albanian',
  [GoogleLocales.AMHARIC]: 'Amharic',
  [GoogleLocales.ARABIC]: 'Arabic',
  [GoogleLocales.ARMENIAN]: 'Armenian',
  [GoogleLocales.AZERBAIJANI]: 'Azerbaijani',
  [GoogleLocales.BASQUE]: 'Basque',
  [GoogleLocales.BELARUSIAN]: 'Belarusian',
  [GoogleLocales.BENGALI]: 'Bengali',
  [GoogleLocales.BOSNIAN]: 'Bosnian',
  [GoogleLocales.BULGARIAN]: 'Bulgarian',
  [GoogleLocales.CATALAN]: 'Catalan',
  [GoogleLocales.CEBUANO]: 'Cebuano',
  [GoogleLocales.CHINESE_SIMPLIFIED]: 'Chinese, Simplified',
  [GoogleLocales.CHINESE_TRADITIONAL]: 'Chinese, Traditional',
  [GoogleLocales.CORSICAN]: 'Corsican',
  [GoogleLocales.CROATIAN]: 'Croatian',
  [GoogleLocales.CZECH]: 'Czech',
  [GoogleLocales.DANISH]: 'Danish',
  [GoogleLocales.DUTCH]: 'Dutch',
  [GoogleLocales.ENGLISH]: 'English',
  [GoogleLocales.ESPERANTO]: 'Esperanto',
  [GoogleLocales.ESTONIAN]: 'Estonian',
  [GoogleLocales.FILIPINO]: 'Filipino',
  [GoogleLocales.FINNISH]: 'Finnish',
  [GoogleLocales.FRENCH]: 'French',
  [GoogleLocales.FRISIAN]: 'Frisian',
  [GoogleLocales.GALICIAN]: 'Galician',
  [GoogleLocales.GEORGIAN]: 'Georgian',
  [GoogleLocales.GERMAN]: 'German',
  [GoogleLocales.GREEK]: 'Greek',
  [GoogleLocales.GUJARATI]: 'Gujarati',
  [GoogleLocales.HAITIAN_CREOLE]: 'Haitian Creole',
  [GoogleLocales.HAUSA]: 'Hausa',
  [GoogleLocales.HAWAIIAN]: 'Hawaiian',
  [GoogleLocales.HEBREW]: 'Hebrew',
  [GoogleLocales.HINDI]: 'Hindi',
  [GoogleLocales.HMONG]: 'Hmong',
  [GoogleLocales.HUNGARIAN]: 'Hungarian',
  [GoogleLocales.ICELANDIC]: 'Icelandic',
  [GoogleLocales.IGBO]: 'Igbo',
  [GoogleLocales.INDONESIAN]: 'Indonesian',
  [GoogleLocales.IRISH]: 'Irish',
  [GoogleLocales.ITALIAN]: 'Italian',
  [GoogleLocales.JAPANESE]: 'Japanese',
  [GoogleLocales.JAVANESE]: 'Javanese',
  [GoogleLocales.KANNADA]: 'Kannada',
  [GoogleLocales.KAZAKH]: 'Kazakh',
  [GoogleLocales.KHMER]: 'Khmer',
  [GoogleLocales.KOREAN]: 'Korean',
  [GoogleLocales.KURDISH]: 'Kurdish',
  [GoogleLocales.KYRGYZ]: 'Kyrgyz',
  [GoogleLocales.LAO]: 'Lao',
  [GoogleLocales.LATIN]: 'Latin',
  [GoogleLocales.LATVIAN]: 'Latvian',
  [GoogleLocales.LITHUANIAN]: 'Lithuanian',
  [GoogleLocales.LUXEMBOURGISH]: 'Luxembourgish',
  [GoogleLocales.MACEDONIAN]: 'Macedonian',
  [GoogleLocales.MALAGASY]: 'Malagasy',
  [GoogleLocales.MALAY]: 'Malay',
  [GoogleLocales.MALAYALAM]: 'Malayalam',
  [GoogleLocales.MALTESE]: 'Maltese',
  [GoogleLocales.MAORI]: 'Maori',
  [GoogleLocales.MARATHI]: 'Marathi',
  [GoogleLocales.MONGOLIAN]: 'Mongolian',
  [GoogleLocales.MYANMAR_BURMESE]: 'Myanmar, Burmese',
  [GoogleLocales.NEPALI]: 'Nepali',
  [GoogleLocales.NORWEGIAN]: 'Norwegian',
  [GoogleLocales.NYANJA_CHICHEWA]: 'Nyanja, Chichewa',
  [GoogleLocales.PASHTO]: 'Pashto',
  [GoogleLocales.PERSIAN]: 'Persian',
  [GoogleLocales.POLISH]: 'Polish',
  [GoogleLocales.PORTUGUESE_BRAZIL]: 'Portuguese, Brazil',
  [GoogleLocales.PORTUGUESE_PORTUGAL]: 'Portuguese, Portugal',
  [GoogleLocales.PUNJABI]: 'Punjabi',
  [GoogleLocales.ROMANIAN]: 'Romanian',
  [GoogleLocales.RUSSIAN]: 'Russian',
  [GoogleLocales.SAMOAN]: 'Samoan',
  [GoogleLocales.SCOTS_GAELIC]: 'Scots Gaelic',
  [GoogleLocales.SERBIAN]: 'Serbian',
  [GoogleLocales.SESOTHO]: 'Sesotho',
  [GoogleLocales.SHONA]: 'Shona',
  [GoogleLocales.SINDHI]: 'Sindhi',
  [GoogleLocales.SINHALA_SINHALESE]: 'Sinhala, Sinhalese',
  [GoogleLocales.SLOVAK]: 'Slovak',
  [GoogleLocales.SLOVENIAN]: 'Slovenian',
  [GoogleLocales.SOMALI]: 'Somali',
  [GoogleLocales.SPANISH]: 'Spanish',
  [GoogleLocales.SUNDANESE]: 'Sundanese',
  [GoogleLocales.SWAHILI]: 'Swahili',
  [GoogleLocales.SWEDISH]: 'Swedish',
  [GoogleLocales.TAGALOG_FILIPINO]: 'Tagalog, Filipino',
  [GoogleLocales.TAJIK]: 'Tajik',
  [GoogleLocales.TAMIL]: 'Tamil',
  [GoogleLocales.TELUGU]: 'Telugu',
  [GoogleLocales.THAI]: 'Thai',
  [GoogleLocales.TURKISH]: 'Turkish',
  [GoogleLocales.UKRAINIAN]: 'Ukrainian',
  [GoogleLocales.URDU]: 'Urdu',
  [GoogleLocales.UZBEK]: 'Uzbek',
  [GoogleLocales.VIETNAMESE]: 'Vietnamese',
  [GoogleLocales.WELSH]: 'Welsh',
  [GoogleLocales.XHOSA]: 'Xhosa',
  [GoogleLocales.YIDDISH]: 'Yiddish',
  [GoogleLocales.YORUBA]: 'Yoruba',
  [GoogleLocales.ZULU]: 'Zulu'
});

export enum LanguageCodes {
  MULTIPLE_LANGUAGES = 'mul',
  PORTUGUESE_PORTUGAL_OTHER = 'pt',
  UNDEFINED = 'und'
}

const DiscordLocales = Locales;
export const GoogleLocaleFromDiscord = Object.freeze({
  [DiscordLocales.ENGLISH_US]: GoogleLocales.ENGLISH,
  [DiscordLocales.ENGLISH_GB]: GoogleLocales.ENGLISH,
  [DiscordLocales.SPANISH]: GoogleLocales.SPANISH,
  [DiscordLocales.SWEDISH]: GoogleLocales.SWEDISH
});
export const AsciiFonts = [
  '3-d',
  '3x5',
  '5lineoblique',
  '1943____',
  '4x4_offr',
  '64f1____',
  'a_zooloo',
  'advenger',
  'aquaplan',
  'asc_____',
  'ascii___',
  'assalt_m',
  'asslt__m',
  'atc_____',
  'atc_gran',
  'b_m__200',
  'battle_s',
  'battlesh',
  'baz__bil',
  'beer_pub',
  'bubble__',
  'bubble_b',
  'c1______',
  'c2______',
  'c_ascii_',
  'c_consen',
  'caus_in_',
  'char1___',
  'char2___',
  'char3___',
  'char4___',
  'charact1',
  'charact2',
  'charact3',
  'charact4',
  'charact5',
  'charact6',
  'characte',
  'charset_',
  'coil_cop',
  'com_sen_',
  'computer',
  'convoy__',
  'd_dragon',
  'dcs_bfmo',
  'deep_str',
  'demo_1__',
  'demo_2__',
  'demo_m__',
  'devilish',
  'druid___',
  'e__fist_',
  'ebbs_1__',
  'ebbs_2__',
  'eca_____',
  'etcrvs__',
  'f15_____',
  'faces_of',
  'fair_mea',
  'fairligh',
  'fantasy_',
  'fbr12___',
  'fbr1____',
  'fbr2____',
  'fbr_stri',
  'fbr_tilt',
  'finalass',
  'fireing_',
  'flyn_sh',
  'fp1_____',
  'fp2_____',
  'funky_dr',
  'future_1',
  'future_2',
  'future_3',
  'future_4',
  'future_5',
  'future_6',
  'future_7',
  'future_8',
  'gauntlet',
  'ghost_bo',
  'gothic',
  'gothic__',
  'grand_pr',
  'green_be',
  'hades___',
  'heavy_me',
  'heroboti',
  'high_noo',
  'hills___',
  'home_pak',
  'house_of',
  'hypa_bal',
  'hyper___',
  'inc_raw_',
  'italics_',
  'joust___',
  'kgames_i',
  'kik_star',
  'krak_out',
  'lazy_jon',
  'letter_w',
  'letterw3',
  'lexible_',
  'mad_nurs',
  'magic_ma',
  'master_o',
  'mayhem_d',
  'mcg_____',
  'mig_ally',
  'modern__',
  'new_asci',
  'nfi1____',
  'notie_ca',
  'npn_____',
  'odel_lak',
  'ok_beer_',
  'outrun__',
  'p_s_h_m_',
  'p_skateb',
  'pacos_pe',
  'panther_',
  'pawn_ins',
  'phonix__',
  'platoon2',
  'platoon_',
  'pod_____',
  'r2-d2___',
  'rad_____',
  'rad_phan',
  'radical_',
  'rainbow_',
  'rally_s2',
  'rally_sp',
  'rampage_',
  'rastan__',
  'raw_recu',
  'rci_____',
  'ripper!_',
  'road_rai',
  'rockbox_',
  'rok_____',
  'roman',
  'roman___',
  'script__',
  'skate_ro',
  'skateord',
  'skateroc',
  'sketch_s',
  'sm______',
  'space_op',
  'spc_demo',
  'star_war',
  'stealth_',
  'stencil1',
  'stencil2',
  'street_s',
  'subteran',
  'super_te',
  't__of_ap',
  'tav1____',
  'taxi____',
  'tec1____',
  'tec_7000',
  'tecrvs__',
  'ti_pan__',
  'timesofl',
  'tomahawk',
  'top_duck',
  'trashman',
  'triad_st',
  'ts1_____',
  'tsm_____',
  'tsn_base',
  'twin_cob',
  'type_set',
  'ucf_fan_',
  'ugalympi',
  'unarmed_',
  'usa_____',
  'usa_pq__',
  'vortron_',
  'war_of_w',
  'yie-ar__',
  'yie_ar_k',
  'z-pilot_',
  'zig_zag_',
  'zone7___',
  'acrobatic',
  'alligator',
  'alligator2',
  'alphabet',
  'avatar',
  'banner',
  'banner3-D',
  'banner3',
  'banner4',
  'barbwire',
  'basic',
  '5x7',
  '5x8',
  '6x10',
  '6x9',
  'brite',
  'briteb',
  'britebi',
  'britei',
  'chartr',
  'chartri',
  'clb6x10',
  'clb8x10',
  'clb8x8',
  'cli8x8',
  'clr4x6',
  'clr5x10',
  'clr5x6',
  'clr5x8',
  'clr6x10',
  'clr6x6',
  'clr6x8',
  'clr7x10',
  'clr7x8',
  'clr8x10',
  'clr8x8',
  'cour',
  'courb',
  'courbi',
  'couri',
  'helv',
  'helvb',
  'helvbi',
  'helvi',
  'sans',
  'sansb',
  'sansbi',
  'sansi',
  'sbook',
  'sbookb',
  'sbookbi',
  'sbooki',
  'times',
  'tty',
  'ttyb',
  'utopia',
  'utopiab',
  'utopiabi',
  'utopiai',
  'xbrite',
  'xbriteb',
  'xbritebi',
  'xbritei',
  'xchartr',
  'xchartri',
  'xcour',
  'xcourb',
  'xcourbi',
  'xcouri',
  'xhelv',
  'xhelvb',
  'xhelvbi',
  'xhelvi',
  'xsans',
  'xsansb',
  'xsansbi',
  'xsansi',
  'xsbook',
  'xsbookb',
  'xsbookbi',
  'xsbooki',
  'xtimes',
  'xtty',
  'xttyb',
  'bell',
  'big',
  'bigchief',
  'binary',
  'block',
  'broadway',
  'bubble',
  'bulbhead',
  'calgphy2',
  'caligraphy',
  'catwalk',
  'chunky',
  'coinstak',
  'colossal',
  'contessa',
  'contrast',
  'cosmic',
  'cosmike',
  'crawford',
  'cricket',
  'cursive',
  'cyberlarge',
  'cybermedium',
  'cybersmall',
  'decimal',
  'diamond',
  'digital',
  'doh',
  'doom',
  'dotmatrix',
  'double',
  'drpepper',
  'dwhistled',
  'eftichess',
  'eftifont',
  'eftipiti',
  'eftirobot',
  'eftitalic',
  'eftiwall',
  'eftiwater',
  'epic',
  'fender',
  'fourtops',
  'fraktur',
  'goofy',
  'graceful',
  'gradient',
  'graffiti',
  'hex',
  'hollywood',
  'invita',
  'isometric1',
  'isometric2',
  'isometric3',
  'isometric4',
  'italic',
  'ivrit',
  'jazmine',
  'jerusalem',
  'katakana',
  'kban',
  'l4me',
  'larry3d',
  'lcd',
  'lean',
  'letters',
  'linux',
  'lockergnome',
  'madrid',
  'marquee',
  'maxfour',
  'mike',
  'mini',
  'mirror',
  'mnemonic',
  'morse',
  'moscow',
  'mshebrew210',
  'nancyj-fancy',
  'nancyj-underlined',
  'nancyj',
  'nipples',
  'ntgreek',
  'nvscript',
  'o8',
  'octal',
  'ogre',
  'os2',
  'pawp',
  'peaks',
  'pebbles',
  'pepper',
  'poison',
  'puffy',
  'pyramid',
  'rectangles',
  'relief',
  'relief2',
  'rev',
  'rot13',
  'rounded',
  'rowancap',
  'rozzo',
  'runic',
  'runyc',
  'sblood',
  'script',
  'serifcap',
  'shadow',
  'short',
  'slant',
  'slide',
  'slscript',
  'small',
  'smisome1',
  'smkeyboard',
  'smscript',
  'smshadow',
  'smslant',
  'smtengwar',
  'speed',
  'stacey',
  'stampatello',
  'standard',
  'starwars',
  'stellar',
  'stop',
  'straight',
  'tanja',
  'tengwar',
  'term',
  'thick',
  'thin',
  'threepoint',
  'ticks',
  'ticksslant',
  'tinker-toy',
  'tombstone',
  'trek',
  'tsalagi',
  'twopoint',
  'univers',
  'usaflag',
  'weird',
  'whimsy'
];
export namespace Regex {
  export const UNICODE_EMOJI = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
  export const EMOJI = /<a?:(\w+):(\d+)>/g;
  export const JUMP_CHANNEL = /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)$/g;
  export const JUMP_CHANNEL_MESSAGE = /^(?:https?):\/\/(?:(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/channels\/)(\@me|\d+)\/(\d+)\/(\d+)$/g;
  export const MENTION_CHANNEL = /<#(\d+)>/g;
  export const MENTION_ROLE = /<@&(\d+)>/g;
  export const MENTION_USER = /<@(!?)(\d+)>/g;
  export const TEXT_BOLD = /\*\*([\s\S]+?)\*\*/g;
  export const TEXT_CODEBLOCK = /```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/gi;
  export const TEXT_CODESTRING = /`([\s\S]+?)`/g;
  export const TEXT_ITALICS = /_([\s\S]+?)_|\*([\s\S]+?)\*/g;
  export const TEXT_SNOWFLAKE = /(\d+)/g;
  export const TEXT_SPOILER = /\|\|([\s\S]+?)\|\|/g;
  export const TEXT_STRIKE = /~~([\s\S]+?)~~(?!_)/g;
  export const TEXT_UNDERLINE = /__([\s\S]+?)__/g;
  export const TEXT_URL = /((?:https?):\/\/[^\s<]+[^<.,:;"'\]\s])/g;
  export const VALID_URL = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
}
export enum DiscordUserFlags {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
  HYPESQUAD = 1 << 2,
  BUG_HUNTER_LEVEL_1 = 1 << 3,
  MFA_SMS = 1 << 4,
  PREMIUM_PROMO_DISMISSED = 1 << 5,
  HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
  HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
  HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
  PREMIUM_EARLY_SUPPORTER = 1 << 9,
  TEAM_USER = 1 << 10,
  SYSTEM = 1 << 12,
  HAS_UNREAD_URGENT_MESSAGES = 1 << 13,
  BUG_HUNTER_LEVEL_2 = 1 << 14,
  VERIFIED_BOT = 1 << 16,
  VERIFIED_DEVELOPER = 1 << 17,
  DISCORD_CERTIFIED_MODERATOR = 1 << 18
}
export const DiscordEmojis = {
  DISCORD_BADGES: {
    [DiscordUserFlags.STAFF]: '<:IconBadge_Staff:798624241595318272>',
    [DiscordUserFlags.PARTNER]: '<:IconBadge_Partner:798624238939406416>',
    [DiscordUserFlags.HYPESQUAD]: '<:IconBadge_HypeSquad:798624232451473448>',
    [DiscordUserFlags.BUG_HUNTER_LEVEL_1]:
      '<:IconBadge_BugHunter:798624232338227261>',
    [DiscordUserFlags.HYPESQUAD_ONLINE_HOUSE_1]:
      '<:IconBadge_HypeSquadBravery:798624232425652244>',
    [DiscordUserFlags.HYPESQUAD_ONLINE_HOUSE_2]:
      '<:IconBadge_HypeSquadBrilliance:798624232552529920>',
    [DiscordUserFlags.HYPESQUAD_ONLINE_HOUSE_3]:
      '<:IconBadge_HypeSquadBalance:798624232409661451>',
    [DiscordUserFlags.PREMIUM_EARLY_SUPPORTER]:
      '<:IconBadge_EarlySupporter:798624232471920680>',
    [DiscordUserFlags.BUG_HUNTER_LEVEL_2]:
      '<:IconBadge_BugHunterGold:799290353357684797>',
    [DiscordUserFlags.VERIFIED_DEVELOPER]:
      '<:IconBadge_BotDeveloper:798624232443478037> ',
    [DiscordUserFlags.DISCORD_CERTIFIED_MODERATOR]:
      '<:IconBadge_CertifiedModerator:889779348943536148>'
  } as Record<DiscordUserFlags, string>,
  DISCORD_TAG_BOT:
    '<:IconTag_Bot1:889780363524710441><:IconTag_Bot2:889780363424063498>',
  DISCORD_TAG_SYSTEM:
    '<:IconTag_System1:889780763678105630><:IconTag_System2:889780763590033408>'
};
