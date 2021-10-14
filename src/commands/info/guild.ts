import { Discord } from '../../endpoints';
import { codeblock, spoiler } from '../../functions/markup';
import {
  Colors,
  commands,
  DateOptions,
  DEFAULT_MAX_MEMBERS,
  GuildExplicitContentFilterTypeTexts,
  VerificationLevelTexts
} from '../../globals';
import {
  editOrReply,
  expandStructure,
  formatMemory,
  guildIdToShardId,
  toTitleCase
} from '../../tools';
import {
  asyncIteratorToArray,
  getAcronym,
  getLongAgoFormat,
  getMaxEmojis,
  guildHasPublic,
  guildJumplink,
  preferredLocaleText
} from '../../util';

commands.on(
  {
    name: 'guild',
    aliases: ['guildinfo', 'server', 'serverinfo'],
    description: 'Get information for a guild, defaults to the current guild'
  },
  (args) => ({}),
  async (message, args) => {
    const guild = await discord.getGuild();
    const channels = await guild.getChannels();
    const emojis = await guild.getEmojis();
    const {
      memberCount,
      ownerId
      // presenceCount
    } = guild;
    const voiceStateCount = (
      await asyncIteratorToArray(guild.iterVoiceStates())
    ).length;
    const owner = (await guild.getMember(ownerId))!;

    const embed = new discord.Embed();
    embed.setAuthor({
      name: guild.name,
      iconUrl: guild.getIconUrl() || undefined,
      url: guildJumplink(guild.id)
    });
    embed.setColor(Colors.BLURPLE);

    if (guild.vanityUrlCode) {
      embed.setFooter({ text: Discord.Invite.SHORT(guild.vanityUrlCode) });
    }
    if (guild.description) {
      embed.setDescription(guild.description);
    }
    if (guild.banner) {
      embed.setThumbnail({ url: guild.getBannerUrl()! });
    } else {
      if (guild.icon) {
        embed.setThumbnail({ url: guild.getIconUrl()! });
      }
    }
    if (guild.splash) {
      embed.setImage({ url: guild.getSplashUrl()! });
    }
    {
      const description: Array<string> = [];

      description.push(`**Acronym**: ${getAcronym(guild.name)}`);
      {
        const timestamp = expandStructure(guild);
        description.push(
          `**Created**: ${getLongAgoFormat(timestamp.createdAtUnix, 2)}`
        );
        description.push(
          `**->** ${spoiler(
            timestamp.createdAt.toLocaleString(undefined, DateOptions)
          )}`
        );
      }
      description.push(`**Id**: \`${guild.id}\``);
      if (guild.preferredLocale)
        description.push(
          `**Locale**: \`${preferredLocaleText(guild) ||
            guild.preferredLocale}\``
        );
      description.push(
        `**Nitro Tier**: ${
          guild.premiumTier ? `Level ${guild.premiumTier}` : 'None'
        }`
      );
      if (guild.id === message.guildId) {
        description.push(`**Owner**: <@!${guild.ownerId}>`);
      } else {
        description.push(`**Owner**: ${owner.toMention()}`);
        description.push(`**Owner Id**: \`${owner.user.id}\``);
      }
      description.push(`**Region**: \`${guild.region}\``);
      description.push(
        `**Server Type**: ${guildHasPublic(guild) ? 'Public' : 'Private'}`
      );

      //   description.push(`**Shard Id**: \`${guildIdToShardId(guild.id)}\``);
      // Application Id
      // large
      // lazy
      // system channel flags

      embed.addField({
        name: 'Information',
        value: description.join('\n'),
        inline: true
      });
    }
    {
      const description: Array<string> = [];

      description.push(`**AFK Timeout**: ${guild.afkTimeout} seconds`);
      description.push(
        `**Content Filter**: ${GuildExplicitContentFilterTypeTexts[
          guild.explicitContentFilter
        ] || 'Unknown'}`
      );
      description.push(
        `**Message Notifs**: ${
          guild.defaultMessageNotifications ? 'Mentions' : 'All'
        }`
      );
      description.push(`**MFA**: ${guild.mfaLevel ? 'Required' : 'Optional'}`);
      description.push(
        `**Verification**: ${VerificationLevelTexts[guild.verificationLevel] ||
          'Unknown'}`
      );

      embed.addField({
        name: 'Moderation',
        value: description.join('\n'),
        inline: true
      });
    }
    {
      function getChannelName(channelId: string): string {
        if (
          message.guildId !== guild.id &&
          channels.some((v) => v.id === channelId)
        ) {
          const channel = channels.find((v) => v.id === channelId)!;
          return `${channel} (${channelId})`;
        }
        return `<#${channelId}>`;
      }

      const description: Array<string> = [];
      if (guild.afkChannelId) {
        const name = getChannelName(guild.afkChannelId);
        description.push(`**AFK**: ${name}`);
      }
      const defaultChannel = channels.find(
        (channel: discord.GuildChannel) =>
          channel.position === 0 && channel instanceof discord.GuildTextChannel
      );
      if (defaultChannel) {
        const name =
          message.guildId === guild.id
            ? defaultChannel.toMention()
            : `${defaultChannel} (${defaultChannel.id})`;
        description.push(`**Default**: ${name}`);
      }
      // add when spencer fixes typings !!
      // if (guild.rulesChannelId) {
      //   const name = getChannelName(guild.rulesChannelId);
      //   description.push(`**Rules**: ${name}`);
      // }
      if (guild.systemChannelId) {
        const name = getChannelName(guild.systemChannelId);
        description.push(`**System**: ${name}`);
      }
      if (guild.widgetChannelId) {
        const name = getChannelName(guild.widgetChannelId);
        description.push(`**Widget**: ${name}`);
      }
      if (description.length) {
        embed.addField({
          name: 'Channels',
          value: description.join('\n'),
          inline: false
        });
      }
    }
    {
      {
        const animatedEmojis = emojis.filter(
          (emoji: discord.Emoji) => emoji.animated
        ).length;
        const categoryChannels = channels.filter(
          (channel) => channel instanceof discord.GuildCategory
        ).length;
        const newsChannels = channels.filter(
          (channel) => channel instanceof discord.GuildNewsChannel
        ).length;
        const storeChannels = channels.filter(
          (channel) => channel instanceof discord.GuildStoreChannel
        ).length;
        const textChannels = channels.filter(
          (channel) => channel instanceof discord.GuildTextChannel
        ).length;
        const voiceChannels = channels.filter(
          (channel) => channel instanceof discord.GuildVoiceChannel
        ).length;

        const column: Array<string> = [];

        column.push(`Channels: ${channels.length.toLocaleString()}`);
        if (categoryChannels) {
          column.push(` -[Category]: ${categoryChannels.toLocaleString()}`);
        }
        if (newsChannels) {
          column.push(` -[News]: ${newsChannels.toLocaleString()}`);
        }
        if (storeChannels) {
          column.push(` -[Store]: ${storeChannels.toLocaleString()}`);
        }
        if (textChannels) {
          column.push(` -[Text]: ${textChannels.toLocaleString()}`);
        }
        if (voiceChannels) {
          column.push(` -[Voice]: ${voiceChannels.toLocaleString()}`);
        }
        column.push(`Emojis: ${emojis.length.toLocaleString()}`);
        column.push(` -[Anim]: ${animatedEmojis.toLocaleString()}`);
        column.push(
          ` -[Regular]: ${(emojis.length - animatedEmojis).toLocaleString()}`
        );

        embed.addField({
          name: 'Counts',
          value: codeblock(column.join('\n'), { language: 'css' }),
          inline: true
        });
      }

      {
        const column: Array<string> = [];

        column.push(
          `Boosts: ${guild.premiumSubscriptionCount.toLocaleString()}`
        );
        column.push(`Members: ${memberCount.toLocaleString()}`);
        column.push(
          `Overwrites: ${channels
            .reduce(
              (x: number, channel: discord.GuildChannel) =>
                x + channel.permissionOverwrites.length,
              0
            )
            .toLocaleString()}`
        );
        // column.push(`Presences: ${presenceCount.toLocaleString()}`);
        const roles = await guild.getRoles();
        const managedRoles = roles.filter((role) => role.managed).length;
        column.push(`Roles: ${roles.length.toLocaleString()}`);
        column.push(` -[Managed]: ${managedRoles.toLocaleString()}`);
        column.push(
          ` -[Regular]: ${(roles.length - managedRoles).toLocaleString()}`
        );
        column.push(`VoiceStates: ${voiceStateCount.toLocaleString()}`);

        embed.addField({
          name: 'Counts',
          value: codeblock(column.join('\n'), { language: 'css' }),
          inline: true
        });
      }
    }
    embed.addField({ name: '\u200b', value: '\u200b' });
    {
      const description: Array<string> = [];

      // description.push(`Attachment: ${formatMemory(guild.maxAttachmentSize)}`);
      // description.push(
      //   `Bitrate: ${(guild.maxBitrate / 1000).toLocaleString()} kbps`
      // );
      description.push(`Emojis: ${getMaxEmojis(guild) * 2}`);
      description.push(` -[Anim]: ${getMaxEmojis(guild)}`);
      description.push(` -[Regular]: ${getMaxEmojis(guild)}`);
      description.push(`Members: ${DEFAULT_MAX_MEMBERS.toLocaleString()}`);
      description.push(`Presences: ${guild.maxPresences.toLocaleString()}`);

      embed.addField({
        name: 'Limits',
        value: codeblock(description.join('\n'), { language: 'css' }),
        inline: true
      });
    }
    if (guild.features.length) {
      const description = guild.features
        .sort()
        .map((feature: string) => toTitleCase(feature));
      embed.addField({
        name: 'Features',
        value: codeblock(description.join('\n')),
        inline: true
      });
    }
    {
      const description: Array<string> = [];

      if (guild.banner) {
        description.push(`[**Banner Image**](${guild.getBannerUrl()})`);
      }
      // if (guild.discoverySplash) {
      //   description.push(
      //     `[**Discovery Splash**](${guild.getDiscoverySplashUrl(null, {
      //       size: 1024,
      //     })})`
      //   );
      // }
      description.push(`[**Guild**](${guildJumplink(guild.id)})`);
      if (guild.icon) {
        description.push(`[**Icon Image**](${guild.getIconUrl()})`);
      }
      if (guild.splash) {
        description.push(`[**Splash Image**](${guild.getSplashUrl()})`);
      }
      if (guild.widgetEnabled) {
        // description.push(`[**Widget**](${guild.widgetChannelId})`);
        // description.push(`[**Widget Image**](${guild.widgetImageUrl})`);
      }

      embed.addField({ name: 'Urls', value: description.join(', ') });
    }
    return editOrReply(message, { embed });
  }
);
