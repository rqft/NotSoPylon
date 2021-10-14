import * as Timers from './timers';

import { emojiIdentifier } from '../util';

import { editOrReply } from '../tools';

export const MAX_PAGE = Number.MAX_SAFE_INTEGER;
export const MIN_PAGE = 1;

export const PageEmojis = Object.freeze({
  custom: '🔢',
  info: 'ℹ',
  next: '➡',
  nextDouble: '⏭',
  previous: '⬅',
  previousDouble: '⏮',
  stop: '⏹'
});

export type OnErrorCallback = (
  error: any,
  paginator: Paginator
) => Promise<any> | any;
export type OnExpireCallback = (paginator: Paginator) => Promise<any> | any;
export type OnPageCallback = (
  page: number
) => Promise<discord.Embed> | discord.Embed;
export type OnPageNumberCallback = (
  content: string
) => Promise<number> | number;

export interface PaginatorEmojis {
  custom?: discord.Emoji | string;
  info?: discord.Emoji | string;
  next?: discord.Emoji | string;
  previous?: discord.Emoji | string;
  stop?: discord.Emoji | string;
}

export interface PaginatorOptions {
  emojis?: PaginatorEmojis;
  expire?: number;
  message?: discord.GuildMemberMessage;
  page?: number;
  pageLimit?: number;
  pageSkipAmount?: number;
  pages?: Array<discord.Embed>;
  targets?: Array<discord.GuildMember | discord.User | string>;

  onError?: OnErrorCallback;
  onExpire?: OnExpireCallback;
  onPage?: OnPageCallback;
  onPageNumber?: OnPageNumberCallback;
}

export class Paginator {
  readonly context: discord.GuildMemberMessage;
  readonly custom: {
    expire: number;
    message?: null | discord.Message;
    timeout: Timers.Timeout;
    userId?: null | string;
  } = {
    expire: 10000,
    timeout: new Timers.Timeout()
  };
  readonly timeout = new Timers.Timeout();

  emojis: { [key: string]: discord.Emoji } = {};
  expires: number = 60000;
  isOnGuide: boolean = false;
  message: null | discord.Message = null;
  page: number = MIN_PAGE;
  pageLimit: number = MAX_PAGE;
  pageSkipAmount: number = 10;
  pages?: Array<discord.Embed>;
  ratelimit: number = 1500;
  ratelimitTimeout = new Timers.Timeout();
  stopped: boolean = false;
  targets: Array<string> = [];

  onError?: OnErrorCallback;
  onExpire?: OnExpireCallback;
  onPage?: OnPageCallback;
  onPageNumber?: OnPageNumberCallback;

  constructor(context: discord.GuildMemberMessage, options: PaginatorOptions) {
    this.context = context;
    this.message = options.message || null;

    if (Array.isArray(options.pages)) {
      this.pages = options.pages;
      this.pageLimit = this.pages.length;
    } else {
      if (options.pageLimit !== undefined) {
        this.pageLimit = Math.max(
          MIN_PAGE,
          Math.min(options.pageLimit, MAX_PAGE)
        );
      }
    }

    if (options.page !== undefined) {
      this.page = Math.max(MIN_PAGE, Math.min(options.page, MAX_PAGE));
    }
    this.pageSkipAmount = Math.max(
      2,
      options.pageSkipAmount || this.pageSkipAmount
    );

    if (Array.isArray(options.targets)) {
      for (let target of options.targets) {
        if (typeof target === 'string') {
          this.targets.push(target);
        } else {
          this.targets.push(
            target instanceof discord.User ? target.id : target.user.id
          );
        }
      }
    } else {
      if (context instanceof discord.GuildMember) {
        this.targets.push(context.author.id);
      }
    }

    if (!this.targets.length) {
      throw new Error('A userId must be specified in the targets array');
    }

    const emojis: PaginatorEmojis = Object.assign(
      {},
      PageEmojis,
      options.emojis
    );

    this.onError = options.onError;
    this.onExpire = options.onExpire;
    this.onPage = options.onPage;
    this.onPageNumber = options.onPageNumber;

    Object.defineProperties(this, {
      context: { enumerable: false },
      custom: { enumerable: false },
      emojis: { enumerable: false },
      message: { enumerable: false },
      timeout: { enumerable: false },
      onError: { enumerable: false },
      onExpire: { enumerable: false },
      onPage: { enumerable: false },
      onPageNumber: { enumerable: false }
    });
  }

  get isLarge(): boolean {
    return this.pageSkipAmount < this.pageLimit;
  }

  addPage(embed: discord.Embed): Paginator {
    if (typeof this.onPage === 'function') {
      throw new Error(
        'Cannot add a page when onPage is attached to the paginator'
      );
    }
    if (!Array.isArray(this.pages)) {
      this.pages = [];
    }
    this.pages.push(embed);
    this.pageLimit = this.pages.length;
    return this;
  }

  async clearCustomMessage(): Promise<void> {
    this.custom.timeout.stop();
    if (this.custom.message) {
      this.custom.message = null;
    }
  }

  async getGuidePage(): Promise<discord.Embed> {
    const embed = new discord.Embed();
    embed.setTitle('Interactive Paginator Guide');
    embed.setDescription(
      [
        'This allows you to navigate through pages of text using reactions.\n',
        `${this.emojis.previous} - Goes back one page`,
        `${this.emojis.next} - Goes forward one page`,
        `${this.emojis.custom} - Allows you to choose a number via text`,
        `${this.emojis.stop} - Stops the paginator`,
        `${this.emojis.info} - Shows this guide`
      ].join('\n')
    );
    embed.setFooter({ text: `We were on page ${this.page.toLocaleString()}.` });
    return embed;
  }

  async getPage(page: number): Promise<discord.Embed> {
    if (typeof this.onPage === 'function') {
      return await Promise.resolve(this.onPage(this.page));
    }
    if (Array.isArray(this.pages)) {
      page -= 1;
      if (page in this.pages) {
        return this.pages[page];
      }
    }
    throw new Error(`Page ${page} not found`);
  }

  async setPage(page: number): Promise<void> {
    if (this.message && (this.isOnGuide || page !== this.page)) {
      this.isOnGuide = false;
      this.page = page;
      const embed = await this.getPage(page);
      await this.message.edit({ embed });
    }
  }

  async onMessageReactionAdd({
    messageId,
    reaction,
    userId
  }: {
    messageId: string;
    reaction: discord.Message.IMessageReaction;
    userId: string;
  }) {
    if (this.stopped) {
      return;
    }
    if (!this.message || this.message.id !== messageId) {
      return;
    }
    if (
      !this.targets.includes(userId)
      //    &&
      //   !this.context.client.isOwner(userId)
    ) {
      return;
    }
    if (this.ratelimitTimeout.hasStarted) {
      return;
    }

    try {
      switch (emojiIdentifier(reaction.emoji)) {
        case emojiIdentifier(this.emojis.previousDouble):
          {
            if (!this.isLarge) {
              return;
            }
            const page = Math.max(this.page - this.pageSkipAmount, MIN_PAGE);
            await this.setPage(page);
          }
          break;
        case emojiIdentifier(this.emojis.previous):
          {
            const page = this.page - 1;
            if (MIN_PAGE <= page) {
              await this.setPage(page);
            }
          }
          break;

        case emojiIdentifier(this.emojis.next):
          {
            const page = this.page + 1;
            if (page <= this.pageLimit) {
              await this.setPage(page);
            }
          }
          break;
        case emojiIdentifier(this.emojis.nextDouble):
          {
            if (!this.isLarge) {
              return;
            }
            const page = Math.min(
              this.page + this.pageSkipAmount,
              this.pageLimit
            );
            await this.setPage(page);
          }
          break;

        case emojiIdentifier(this.emojis.custom):
          {
            if (!this.custom.message) {
              await this.clearCustomMessage();
              this.custom.message = await this.message.reply(
                'What page would you like to go to?'
              );
              this.custom.timeout.start(this.custom.expire, async () => {
                await this.clearCustomMessage();
              });
            }
          }
          break;
        case emojiIdentifier(this.emojis.stop):
          {
            await this.onStop();
          }
          break;
        case emojiIdentifier(this.emojis.info):
          {
            if (!this.isOnGuide) {
              this.isOnGuide = true;
              const embed = await this.getGuidePage();
              await this.message.edit({
                embed
              });
            }
          }
          break;
        default: {
          return;
        }
      }

      this.timeout.start(this.expires, this.onStop.bind(this));
      this.ratelimitTimeout.start(this.ratelimit, () => {});
      /*
      if (this.message.canManage) {
        await reaction.delete(userId);
      }
      */
    } catch (error) {
      if (typeof this.onError === 'function') {
        await Promise.resolve(this.onError(error, this));
      }
    }
  }

  async onStop(error?: any, clearEmojis: boolean = true) {
    this.reset();
    if (!this.stopped) {
      this.stopped = true;
      try {
        if (error) {
          if (typeof this.onError === 'function') {
            await Promise.resolve(this.onError(error, this));
          }
        }
        if (typeof this.onExpire === 'function') {
          await Promise.resolve(this.onExpire(this));
        }
      } catch (error) {
        if (typeof this.onError === 'function') {
          await Promise.resolve(this.onError(error, this));
        }
      }
      if (clearEmojis) {
        if (
          this.message &&
          !this.message.id &&
          (await (await discord.getGuild()).getMember(discord.getBotId()))!.can(
            discord.Permissions.MANAGE_MESSAGES
          )
        ) {
          try {
            await this.message.deleteAllReactions();
          } catch (error) {}
        }
      }
      await this.clearCustomMessage();

      this.onError = undefined;
      this.onExpire = undefined;
      this.onPage = undefined;
      this.onPageNumber = undefined;
    }
  }

  reset() {
    this.timeout.stop();
    this.custom.timeout.stop();
    this.ratelimitTimeout.stop();
  }

  async start() {
    if (
      typeof this.onPage !== 'function' &&
      !(this.pages && this.pages.length)
    ) {
      throw new Error(
        'Paginator needs an onPage function or at least one page added to it'
      );
    }

    let message: discord.Message;
    if (this.message) {
      message = this.message;
    } else {
      if (
        !(await (await discord.getGuild()).getMember(discord.getBotId()))!.can(
          discord.Permissions.SEND_MESSAGES
        )
      ) {
        throw new Error('Cannot create messages in this channel');
      }
      const embed = await this.getPage(this.page);
      if (this.context instanceof discord.Message) {
        message = this.message = await editOrReply(this.context, { embed });
      }
    }

    this.reset();
    if (
      !this.stopped &&
      this.pageLimit !== MIN_PAGE &&
      !(await (await discord.getGuild()).getMember(discord.getBotId()))!.can(
        discord.Permissions.ADD_REACTIONS
      )
    ) {
      try {
        this.timeout.start(this.expires, this.onStop.bind(this));
        const emojis = [
          this.isLarge ? this.emojis.previousDouble : null,
          this.emojis.previous,
          this.emojis.next,
          this.isLarge ? this.emojis.nextDouble : null,
          this.emojis.custom,
          this.emojis.stop,
          this.emojis.info
        ].filter((v) => v);

        for (let emoji of emojis) {
          if (this.stopped || !message!.id) {
            break;
          }
          if (
            message!.reactions.find(
              (v) => v.emoji.id === emoji!.id || v.emoji.name === emoji!.name
            ) !== undefined
          ) {
            continue;
          }
          await message!.addReaction(emojiIdentifier(emoji!));
        }
      } catch (error) {
        if (typeof this.onError === 'function') {
          this.onError(error, this);
        }
      }
    }

    return message!;
  }

  stop(clearEmojis: boolean = true) {
    return this.onStop(null, clearEmojis);
  }
}
