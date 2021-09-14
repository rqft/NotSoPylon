import { findEmoji, isSnowflake, asyncIteratorToArray } from "./util";
import { regex as discordRegex, DiscordRegexNames } from "./globals";
import { findImageUrlInMessages } from "./functions/findImage";

import { Discord } from "./endpoints";
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
          const message = <discord.GuildMemberMessage>(
            await (await context.getChannel()).getMessage(mRef.messageId)
          );
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
                  const message = <discord.GuildMemberMessage>(
                    await (await context.getChannel()).getMessage(messageId)
                  );

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
        if (value.includes("#") && !value.startsWith("#")) {
          const found = await member(context, value);
          if (found) {
            return found.user.getAvatarUrl();
          }
          return null;
        }

        // it's in the form of <@123>
        {
          const { matches } = discordRegex(
            DiscordRegexNames.MENTION_USER,
            value
          ) as { matches: Array<{ id: string }> };
          if (matches.length) {
            const [{ id: userId }] = matches;

            // pass it onto the next statement
            if (isSnowflake(userId)) {
              value = userId;
            }
          }
        }

        // it's just the snowflake of a user
        if (isSnowflake(value)) {
          const userId = value;

          let user: discord.User;
          if (context.mentions.some((v) => v.id === userId)) {
            user = context.mentions.find((v) => v.id === userId);
            if (user instanceof discord.GuildMember) user = user.user;
          } else {
            user = await discord.getUser(userId);
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
            const format = animated ? "gif" : "png";
            return Discord.CDN.URL + Discord.CDN.EMOJI(id, format);
          }
        }

        // it's an unicode emoji
        {
          const emojiTry = findEmoji(value);
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
      return null;
    }
    return null;
  }

  const foundUserSemantics = [
    {
      names: ["self", "me", "this"],
      value: async (context: discord.GuildMemberMessage) => context.member.user,
    },
    {
      names: ["bot", "client"],
      value: async (_: discord.GuildMemberMessage) => discord.getBotUser(),
    },
  ];
  const foundMemberSemantics = [
    {
      names: ["self", "me", "this"],
      value: async (_: discord.GuildMemberMessage) => _.member,
    },
    {
      names: ["bot", "client"],
      value: async (_: discord.GuildMemberMessage) =>
        await (await _.getGuild()).getMember(discord.getBotId()),
    },
  ];
  export async function user(
    context: discord.GuildMemberMessage,
    query?: string
  ): Promise<discord.User> {
    if (!query) return context.member.user;
    query = query.toLowerCase();
    if (foundUserSemantics.some((v) => v.names.includes(query)))
      return await foundUserSemantics
        .find((v) => v.names.includes(query))
        .value(context);
    const guild = await discord.getGuild();
    const members = await asyncIteratorToArray(guild.iterMembers());
    const foundMember = members.find(
      (v) =>
        v.user.id === query.replace(/\D/g, "") ||
        (v.nick && v.nick.toLowerCase() === query) ||
        v.user.username === query ||
        v.user.getTag() === query
    );
    const foundUser = foundMember
      ? foundMember.user
      : await discord.getUser(query);
    if (!foundUser) throw new Error(`Cannot find user '${query}'`);
  }
  export async function member(
    context: discord.GuildMemberMessage,
    query?: string
  ): Promise<discord.GuildMember> {
    if (!query) return context.member;
    query = query.toLowerCase();
    if (foundUserSemantics.some((v) => v.names.includes(query)))
      return await foundMemberSemantics
        .find((v) => v.names.includes(query))
        .value(context);
    const guild = await discord.getGuild();
    const members = await asyncIteratorToArray(guild.iterMembers());
    const foundMember = members.find(
      (v) =>
        v.user.id === query.replace(/\D/g, "") ||
        (v.nick && v.nick.toLowerCase() === query) ||
        v.user.username === query ||
        v.user.getTag() === query
    );
    if (!foundMember) throw new Error(`Cannot find member '${query}'`);
    return foundMember;
  }
}
