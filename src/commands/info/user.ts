import config from '../../config';
import { spoiler } from '../../functions/markup';
import {
  commands,
  DateOptions,
  DiscordEmojis,
  DiscordUserFlags,
  PresenceStatusColors
} from '../../globals';
import { Parameters } from '../../parameters';
import {
  editOrReply,
  ExpandedGuildMember,
  ExpandedStructure,
  expandStructure
} from '../../tools';
import { getLongAgoFormat, getMemberJoinPosition } from '../../util';
interface DiscardUserProfile {
  connected_accounts: Array<unknown>;
  premium_guild_since?: string;
  premium_since?: string;
  user: DiscardUser;
  discard: {
    settings: number;
    role: number;
  };
}
interface DiscardUser {
  status?: string;
  username: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  discriminator: string;
  flags: number;
  id: string;
}
commands.on(
  {
    name: 'user',
    aliases: ['userinfo', 'member', 'memberinfo'],
    description: 'Get information about a user, defaults to self'
  },
  (args) => ({
    user: args.stringOptional()
  }),
  async (message, args) => {
    const member = await Parameters.member(
      message,
      args.user || message.member.user.id
    );
    const user = await Parameters.user(
      message,
      args.user || message.member.user.id
    );
    if (!user) return await editOrReply(message, ':warning: `User not found`');
    const discardUser: DiscardUserProfile = await (
      await fetch(
        'https://test.discard.cc/api/v0/users/' + user.id + '/profile',
        {
          headers: {
            Authorization: config.keys.discard_cc
          }
        }
      )
    ).json();
    const isMember = !!member;
    const guild = await message.getGuild();
    const embed = new discord.Embed();
    embed.setAuthor({ name: user.getTag(), iconUrl: user.getAvatarUrl() });
    embed.setColor(
      PresenceStatusColors[
        member ? (await member.getPresence()).status : 'offline'
      ]
    );
    embed.setDescription(user.toMention());
    embed.setThumbnail({ url: user.getAvatarUrl() });
    {
      const description: Array<string> = [];
      {
        const badges: Array<string> = [];
        for (let key in DiscordEmojis.DISCORD_BADGES) {
          if ((BigInt(discardUser.user.flags) & BigInt(key)) === BigInt(key)) {
            badges.push(DiscordEmojis.DISCORD_BADGES[key]);
          }
        }
        if (badges.length) {
          description.push(`**Badges**: ${badges.join(' ')}`);
        }
      }

      description.push(`**Bot**: ${user.bot ? 'Yes' : 'No'}`);
      description.push(`**Id**: \`${user.id}\``);
      const isSystem =
        (BigInt(discardUser.user.flags) & BigInt(DiscordUserFlags.SYSTEM)) ===
        BigInt(DiscordUserFlags.SYSTEM);
      const isVerifiedBot =
        (BigInt(discardUser.user.flags) &
          BigInt(DiscordUserFlags.VERIFIED_BOT)) ===
        BigInt(DiscordUserFlags.VERIFIED_BOT);
      if (isSystem) {
        description.push(`**System**: Yes`);
      }
      {
        let tag: string | undefined;
        if (isSystem) {
          tag = DiscordEmojis.DISCORD_TAG_SYSTEM;
        } else if (user.bot) {
          if (isVerifiedBot) {
            tag = DiscordEmojis.DISCORD_TAG_BOT;
          } else {
            tag = DiscordEmojis.DISCORD_TAG_BOT;
          }
        }
        if (tag) {
          description.push(`**Tag**: ${tag}`);
        }
      }
      embed.addField({
        name: 'Information',
        value: description.join('\n'),
        inline: true
      });
    }

    {
      const description: Array<string> = [];
      {
        const timestamp = expandStructure(user!) as ExpandedStructure;
        description.push(
          `**Discord**: ${getLongAgoFormat(timestamp.createdAtUnix, 2)}`
        );
        description.push(
          `**->** ${spoiler(
            timestamp.createdAt.toLocaleString(undefined, DateOptions)
          )}`
        );
      }
      if (isMember && new Date(member.joinedAt)) {
        {
          const timestamp = expandStructure({
            ...member,
            id: member.user.id
          }) as ExpandedGuildMember;
          description.push(
            `**Guild**: ${getLongAgoFormat(timestamp.joinedAtUnix, 2)}`
          );
          description.push(
            `**->** ${spoiler(
              timestamp.joinedAtTimestamp.toLocaleString(undefined, DateOptions)
            )}`
          );
        }

        if (member.guildId) {
          const [position, memberCount] = await getMemberJoinPosition(
            guild,
            member.user.id
          );
          description.push(
            `**Join Position**: ${position.toLocaleString()}/${memberCount.toLocaleString()}`
          );
        }
      }
      embed.addField({
        name: 'Joined',
        value: description.join('\n'),
        inline: true
      });
    }
    if (member) {
      const description: Array<string> = [];

      if (member.premiumSince) {
        const timestamp = expandStructure({
          ...member,
          id: member.user.id
        }) as ExpandedGuildMember;
        description.push(
          `**Boosting Since**: ${getLongAgoFormat(
            timestamp.premiumSinceUnix,
            2
          )}`
        );
        description.push(
          `**->** ${spoiler(
            timestamp.premiumSinceTimestamp.toLocaleString(
              undefined,
              DateOptions
            )
          )}`
        );
      }
      if (member.nick) {
        description.push(`**Nickname**: ${member.nick}`);
      }
      if (member.user.id === guild.ownerId) {
        description.push(`**Owner**: Yes`);
      }
      const roles = (
        await Promise.all(member.roles.map((v) => guild.getRole(v)))
      )
        .sort((x, y) => x!.position - y!.position)
        .map((role) => {
          if (role!.guildId === role!.id) {
            return `\`${role!.name}\``;
          }
          return role!.toMention();
        });
      let rolesText = `**Roles (${roles.length})**: ${roles.join(', ')}`;
      if (800 < rolesText.length) {
        const fromIndex = rolesText.length - (rolesText.length - 800 + 3);
        const index = rolesText.lastIndexOf(',', fromIndex);
        rolesText = rolesText.slice(0, index) + '...';
      }
      description.push(rolesText);

      const voiceState = await guild.getVoiceState(member.user.id);
      if (voiceState) {
        description.push(
          `**Voice**: ${(await voiceState.getChannel())!.toMention()}`
        );
      }
      embed.addField({ name: 'Guild Specific', value: description.join('\n') });
    }
    // {
    //   const description: Array<string> = [];

    //   if (isMember) {
    //     if (member.avatar) {
    //       description.push(
    //         Markup.url(Markup.bold("Guild Avatar"), member.avatarUrl)
    //       );
    //     }
    //   }

    //   if (userWithBanner.banner) {
    //     embed.setImage(userWithBanner.bannerUrl!);
    //     description.push(
    //       Markup.url(
    //         Markup.bold("User Banner"),
    //         userWithBanner.bannerUrlFormat(null, { size: 512 })!
    //       )
    //     );
    //   }

    //   if (description.length) {
    //     description.push(
    //       Markup.url(Markup.bold("User Avatar"), user.avatarUrl)
    //     );
    //     embed.addField("Urls", description.sort().join(", "));
    //   }
    // }
    return await editOrReply(message, embed);
  }
);
