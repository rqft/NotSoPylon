import { isSnowflake, asyncIteratorToArray } from './util';
import {
  regex as discordRegex,
  DiscordRegexNames,
  colorStrings,
  Regex
} from './globals';
import { findImageUrlInMessages } from './functions/findImage';

import { Discord } from './endpoints';
import { hexToInt, inOutAttachment, rgbToInt, validateUrl } from './tools';
export module Parameters {
  export async function role(
    value: string,
    context: discord.GuildMemberMessage
  ): Promise<discord.Role | null> {
    if (value) {
      const guild = await context.getGuild();
      const roles = await guild.getRoles();
      if (guild) {
        {
          const { matches } = discordRegex(
            DiscordRegexNames.MENTION_ROLE,
            value
          ) as { matches: Array<{ id: string }> };
          if (matches.length) {
            const { id: roleId } = matches[0];
            const role = roles.find((v) => v.id === roleId);
            if (role) {
              return role;
            }
          }
        }
        if (isSnowflake(value)) {
          const role = roles.find((v) => v.id === value);
          if (role) {
            return role;
          }
        }
        value = value.toLowerCase();
        for (let role of roles) {
          if (role.name.toLowerCase().startsWith(value)) {
            return role;
          }
        }
        for (let role of roles) {
          if (role.name.toLowerCase().includes(value)) {
            return role;
          }
        }
      }
    }
    return null;
  }
  export async function imageUrl(
    value: string,
    context: discord.GuildMemberMessage
  ): Promise<string | null | undefined> {
    try {
      {
        const _url = validateUrl(value);
        if (_url) return url(value, context);
      }
      // check the message's attachments/stickers first
      {
        const url = findImageUrlInMessages([context]);
        if (url) {
          return url;
        }
      }

      // check for reply and if it has an image
      {
        const mRef = context.messageReference;
        if (mRef && mRef.messageId) {
          const message = (await (await context.getChannel()).getMessage(
            mRef.messageId
          )) as discord.GuildMemberMessage;
          const url = findImageUrlInMessages([message]);
          if (url) {
            return url;
          }
        }
      }

      if (value) {
        // TODO: when spencer actually works on pylon again

        // get last image then
        // if (value === "^") {
        //   return await lastImageUrl("", context);
        // }

        // if it's a url
        {
          const { matches } = discordRegex(
            DiscordRegexNames.TEXT_URL,
            value
          ) as { matches: Array<{ text: string }> };
          if (matches.length) {
            const [{ text }] = matches;

            // if its https://discord.com/channels/:guildId/:channelId/:messageId
            {
              const messageLink = discordRegex(
                DiscordRegexNames.JUMP_CHANNEL_MESSAGE,
                text
              ) as {
                matches: Array<{
                  channelId: string;
                  guildId: string;
                  messageId: string;
                }>;
              };
              if (messageLink.matches.length) {
                const [{ channelId, messageId }] = messageLink.matches;
                if (channelId && messageId) {
                  const message = (await (
                    await context.getChannel()
                  ).getMessage(messageId)) as discord.GuildMemberMessage;

                  const url = findImageUrlInMessages([message]);
                  if (url) {
                    return url;
                  }
                }
              }
            }
          }
        }

        // it's in the form of username#discriminator
        if (value.includes('#') && !value.startsWith('#')) {
          const found = await Parameters.member(context, value);
          if (found) {
            return found.user.getAvatarUrl();
          }
          return null;
        }

        // it's in the form of <@123>
        {
          if (/<@!?\d{16,17}>?/.test(value)) {
            const user = await discord.getUser(value.replace(/\D/g, ''));
            if (user) {
              return user.getAvatarUrl();
            }
            return null;
          }
        }

        // it's just the snowflake of a user
        if (isSnowflake(value)) {
          const userId = value;

          let user: discord.User;
          if (context.mentions.some((v) => v.id === userId)) {
            const a = context.mentions.find((v) => v.id === userId)!;
            user = a;
          } else {
            user = (await discord.getUser(userId))!;
          }
          return user.getAvatarUrl();
        }

        // it's <a:emoji:id>
        {
          const { matches } = discordRegex(DiscordRegexNames.EMOJI, value) as {
            matches: Array<{ animated: boolean; id: string }>;
          };
          if (matches.length) {
            const [{ animated, id }] = matches;
            const format = animated ? 'gif' : 'png';
            return Discord.CDN.URL + Discord.CDN.EMOJI(id, format);
          }
        }

        // it's an unicode emoji
        {
          const emojiTry = emoji(value, context);
          if (emojiTry) return emojiTry.url;
        }

        // try user search (without the discriminator)
        {
          const found = await user(context, value);
          if (found) {
            return found.getAvatarUrl();
          }
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    return null;
  }
  interface Image {
    data: ArrayBuffer;
    url: URL;
    attachment: discord.Message.IMessageAttachment;
    // message: discord.Message;
    // identifier: string;
  }
  export async function image(
    value: string,
    context: discord.GuildMemberMessage,
    filename: string = 'file.png'
  ): Promise<Image> {
    const data = await (
      await fetch((await imageUrl(value, context))!)
    ).arrayBuffer();
    const url = new URL((await imageUrl(value, context))!);
    const att = await inOutAttachment({ name: filename, data });
    return {
      data,
      url,
      attachment: att.attachment
      // message: att.msg,
      // identifier: att.rand
    };
  }

  const foundUserSemantics = [
    {
      names: ['self', 'me', 'this'],
      value: async (context: discord.GuildMemberMessage) => context.member.user
    },
    {
      names: ['bot', 'client'],
      value: async (_: discord.GuildMemberMessage) => discord.getBotUser()
    }
  ];
  const foundMemberSemantics = [
    {
      names: ['self', 'me', 'this'],
      value: async (_: discord.GuildMemberMessage) => _.member
    },
    {
      names: ['bot', 'client'],
      value: async (_: discord.GuildMemberMessage) =>
        await (await _.getGuild()).getMember(discord.getBotId())
    }
  ];
  export async function user(
    context: discord.GuildMemberMessage,
    query?: string
  ): Promise<discord.User | undefined> {
    if (!query) return context.member.user;
    query = query.toLowerCase();
    if (foundUserSemantics.some((v) => v.names.includes(query!)))
      return await foundUserSemantics
        .find((v) => v.names.includes(query!))!
        .value(context);
    const guild = await discord.getGuild();
    const members = await asyncIteratorToArray(guild.iterMembers());
    const foundMember = members.find(
      (v) =>
        v.user.id === query!.replace(/\D/g, '') ||
        (v.nick && v.nick.toLowerCase() === query) ||
        v.user.username.toLowerCase() === query ||
        v.user.getTag().toLowerCase() === query
    );
    let foundUser = undefined;
    try {
      foundUser = foundMember
        ? foundMember.user
        : (await discord.getUser(query))!;
    } catch {}
    return foundUser;
  }
  export async function member(
    context: discord.GuildMemberMessage,
    query?: string
  ): Promise<discord.GuildMember> {
    if (!query) return context.member;
    query = query.toLowerCase();
    if (foundUserSemantics.some((v) => v.names.includes(query!)))
      return (await foundMemberSemantics!
        .find((v) => v.names.includes(query!))!
        .value(context))!;
    const guild = await discord.getGuild();
    const members = await asyncIteratorToArray(guild.iterMembers());
    const foundMember = members.find(
      (v) =>
        v.user.id === query!.replace(/\D/g, '') ||
        (v.nick && v.nick.toLowerCase() === query) ||
        v.user.username.toLowerCase() === query ||
        v.user.getTag().toLowerCase() === query
    );
    if (!foundMember) throw new Error(`Cannot find member '${query}'`);
    return foundMember;
  }
  const RGB_COLOR_REGEX = /^\(?(?:([0-9]{1,2}|1[0-9]{1,2}|2[0-4][0-9]|25[0-5]), ?)(?:([0-9]{1,2}|1[0-9]{1,2}|2[0-4][0-9]|25[0-5]), ?)(?:([0-9]{1,2}|1[0-9]{1,2}|2[0-4][0-9]|25[0-5]))\)?$/i;
  const HEX_COLOR_REGEX = /^#?[0-9A-F]{1,6}$/i;
  const DECIMAL_COLOR_REGEX = /^d\d+$/i;
  const RANDOM_COLOR_REGEX = /^random$/i;
  export function color(value: string, context: discord.GuildMemberMessage) {
    let color;
    if (RANDOM_COLOR_REGEX.test(value))
      color = Math.floor(Math.random() * 16777215);
    if (value.toLowerCase().trim() in colorStrings)
      color = hexToInt(colorStrings[value.toLowerCase().trim()]);
    else if (DECIMAL_COLOR_REGEX.test(value))
      color = parseInt(value.replace(/d/gi, ''), 10);
    else if (HEX_COLOR_REGEX.test(value)) {
      console.log(value);
      color = hexToInt(value);
    } else if (RGB_COLOR_REGEX.test(value)) {
      console.log(value);
      const [r, g, b] = (value.match(/\d+/g) ?? []).map(Number);
      color = rgbToInt(r, g, b);
    }
    return color;
  }
  export function url(
    value: string,
    context: discord.GuildMemberMessage
  ): string | undefined {
    if (value) {
      if (!/^https?:\/\//.test(value)) {
        return `http://${value}`;
      }
      if (!validateUrl(value)) {
        return;
      }
    }
    return value;
  }
  export function booleanFlagsChoices(array: string[], prefix: string) {
    // O(2^n)
    const results: Array<Array<string>> = [[]];
    for (const value of array) {
      const copy = [...results];
      for (const prefix of copy) {
        results.push(prefix.concat(value));
      }
    }
    return results.map((v) => v.map((v) => prefix + v).join(' '));
  }
  export interface EmojiResponse {
    url: string;
    type: 'twemoji' | 'custom';
    id: string;
  }
  export function emoji(
    value: string,
    context: discord.GuildMemberMessage
  ): EmojiResponse | undefined {
    value = value.toLowerCase();
    if (![Regex.EMOJI, Regex.UNICODE_EMOJI].some((v) => v.test(value)))
      return undefined;
    var url: string,
      type: 'twemoji' | 'custom',
      id: string = '';
    if (!value!.replace(/\D/g, '')) {
      const hex = value!.codePointAt(0)!.toString(16);
      const result = '0000'.substring(0, 4 - hex.length) + hex;
      url = `https://cdn.notsobot.com/twemoji/512x512/${result}.png`;
      type = 'twemoji';
    } else {
      url = `https://cdn.discordapp.com/emojis/${value?.replace(/\D/g, '')}.${
        value?.startsWith('<a:') ? 'gif' : 'png'
      }`;
      type = 'custom';
      id = value?.replace(/\D/g, '');
    }
    return {
      url,
      type,
      id
    };
  }
}
