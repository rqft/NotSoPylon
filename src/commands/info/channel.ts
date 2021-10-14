import { ChannelTypesText, Colors, commands, DateOptions } from '../../globals';
import * as Markup from '../../functions/markup';
import { editOrReply, expandStructure } from '../../tools';
import {
  asyncIteratorToArray,
  channelJumplink,
  guildJumplink
} from '../../util';
import { codeblock } from '../../functions/markup';
commands.on(
  {
    name: 'channel',
    aliases: ['channelinfo'],
    description:
      'Get information for a channel, defaults to the current channel'
  },
  (args) => ({
    payload: args.guildChannelOptional()
  }),
  async (message, args) => {
    const channel: discord.GuildChannel =
      args.payload || (await message.getChannel()!);
    const channels = await (await message.getGuild()).getChannels();
    const embed = new discord.Embed();
    embed.setAuthor({
      name: `#${channel.name}`,
      url: `https://discord.com/channels/${channel.guildId}/${channel.id}`
    });
    embed.setColor(Colors.BLURPLE);
    {
      const description: Array<string> = [];
      description.push(
        `${channel.toMention()} ${Markup.spoiler(`(${channel.id})`)}`
      );
      if (
        channel instanceof discord.GuildTextChannel ||
        channel instanceof discord.GuildNewsChannel
      ) {
        description.push('');
        description.push(channel.topic ?? 'No Topic');
      }
      embed.setDescription(description.join('\n'));
    }

    {
      const description: Array<string> = [];

      {
        const timestamp = expandStructure(channel);
        description.push(`**Created**: ${timestamp.age()}`);
        description.push(
          `**->** ${Markup.spoiler(
            timestamp.createdAt.toLocaleString(undefined, DateOptions)
          )}`
        );
      }

      if (channels) {
        const position =
          channels
            .sort((x, y) => parseInt(x.id) - parseInt(y.id))
            .findIndex((c) => c.id === channel.id) + 1;
        description.push(
          `**Created Position**: ${position}/${channels.length}`
        );
      }
      if (channel.guildId) {
        description.push(`**Guild Id**: \`${channel.guildId}\``);
      }
      // can channels even be managed?
      // if (channel.managed) {
      //   description.push(`**Managed**: Yes`);
      // }
      if (channel.parentId) {
        description.push(`**Parent**: <#${channel.parentId}>`);
        description.push(`**->** ${Markup.spoiler(`(${channel.parentId})`)}`);
      }
      if (channel.position !== undefined) {
        description.push(`**Position**: ${channel.position.toLocaleString()}`);
      }
      description.push(
        `**Type**: ${ChannelTypesText[channel.type] || 'Unknown'}`
      );

      embed.addField({
        name: 'Information',
        value: description.join('\n'),
        inline: true
      });
    }
    if (channel instanceof discord.GuildTextChannel) {
      const description: Array<string> = [];

      // add when spencer adds message tracking

      // if (channel.lastMessageId) {
      //   const timestamp = createTimestampMomentFromGuild(
      //     Snowflake.timestamp(channel.lastMessageId),
      //     context.guildId
      //   );
      //   description.push(`**Last Message**: ${timestamp.fromNow()}`);
      //   description.push(
      //     `**->** ${Markup.spoiler(timestamp.format(DateMomentLogFormat))}`
      //   );
      // }
      // if (channel.lastPinTimestampUnix) {
      //   const timestamp = createTimestampMomentFromGuild(
      //     channel.lastPinTimestampUnix,
      //     context.guildId
      //   );
      //   description.push(`**Last Pin**: ${timestamp.fromNow()}`);
      //   description.push(
      //     `**->** ${Markup.spoiler(timestamp.format(DateMomentLogFormat))}`
      //   );
      // }
      if (channel instanceof discord.GuildChannel) {
        description.push(`**NSFW**: ${channel.nsfw ? 'Yes' : 'No'}`);
        if (channel.rateLimitPerUser) {
          description.push(
            `*Ratelimit**: ${channel.rateLimitPerUser.toLocaleString()} seconds`
          );
        } else {
          description.push(`**Ratelimit**: Disabled`);
        }
      }

      embed.addField({
        name: 'Text Information',
        value: description.join('\n'),
        inline: true
      });
    } else if (channel instanceof discord.GuildVoiceChannel) {
      const description: Array<string> = [];

      description.push(
        `**Bitrate**: ${((channel.bitrate || 0) / 1000).toLocaleString()} kbps`
      );
      description.push(
        `**User Limit**: ${
          channel.userLimit ? channel.userLimit.toLocaleString() : 'Unlimited'
        }`
      );

      // add when spencer updates to API v9

      // {
      //   let text: string;
      //   switch (channel.videoQualityMode) {
      //     case ChannelVideoQualityModes.AUTO:
      //       text = "Auto";
      //       break;
      //     case ChannelVideoQualityModes.FULL:
      //       text = "720p";
      //       break;
      //     default:
      //       text = `Unknown (${channel.videoQualityMode})`;
      //   }
      //   description.push(`**Video Quality**: ${text}`);
      // }

      embed.addField({
        name: 'Voice Information',
        value: description.join('\n'),
        inline: true
      });
    }
    // uncomment when Spencer finishes BYOB
    if (
      channel
      //  instanceof discord.DmChannel
    ) {
      const insideDm = message.channelId === channel.id;
      const description: Array<string> = [];

      // const owner = channel.owner;
      // if (owner) {
      //   description.push(`**Owner**: ${insideDm ? owner.mention : owner}`);
      // }
      // const users = channel.recipients.map((user: Structures.User) =>
      //   insideDm ? user.mention : user.toString()
      // );
      // description.push(`**Recipients (${users.length})**: ${users.join(", ")}`);

      // embed.addField("DM Information", description.join("\n"));
    }
    if (channel instanceof discord.GuildChannel) {
      const description: Array<string> = [];

      if (channel instanceof discord.GuildCategory && channels) {
        const children = channels.filter(
          (child) => child.parentId === channel.id
        );
        const newsChannels = children.filter(
          (child) => child instanceof discord.GuildNewsChannel
        ).length;
        const storeChannels = children.filter(
          (child) => child instanceof discord.GuildStoreChannel
        ).length;
        const textChannels = children.filter(
          (child) => child instanceof discord.GuildTextChannel
        ).length;
        const voiceChannels = children.filter(
          (child) => child instanceof discord.GuildVoiceChannel
        ).length;

        description.push(`Children: ${children.length}`);
        if (newsChannels) {
          description.push(` -[News]: ${newsChannels.toLocaleString()}`);
        }
        if (storeChannels) {
          description.push(` -[Store]: ${storeChannels.toLocaleString()}`);
        }
        if (textChannels) {
          description.push(` -[Text]: ${textChannels.toLocaleString()}`);
        }
        if (voiceChannels) {
          description.push(` -[Voice]: ${voiceChannels.toLocaleString()}`);
        }
      }
      description.push(
        `Overwrites: ${channel.permissionOverwrites.length.toLocaleString()}`
      );

      if (
        channel instanceof discord.GuildVoiceChannel ||
        channel instanceof discord.GuildStageVoiceChannel
      ) {
        description.push('');
        const voiceStates = await asyncIteratorToArray(
          (await discord.getGuild()).iterVoiceStates({
            channelId: channel.id
          })
        );
        const membersAmount = voiceStates.length;
        if (channel instanceof discord.GuildStageVoiceChannel) {
          const listenersAmount = voiceStates.filter(
            (voiceState) => !!voiceState.requestToSpeakTimestamp
          ).length;
          const speakersAmount = membersAmount - listenersAmount;

          description.push(`Listeners: ${listenersAmount.toLocaleString()}`);
          description.push(`Speakers: ${speakersAmount.toLocaleString()}`);
          description.push(`Total: ${membersAmount.toLocaleString()}`);
        } else {
          description.push(`Members: ${membersAmount.toLocaleString()}`);
        }
      }

      if (description.length) {
        embed.addField({
          name: 'Counts',
          value: codeblock(description.join('\n'), { language: 'css' })
        });
      }
    }
    {
      const description: Array<string> = [];

      description.push(`[**Channel**](${channelJumplink(channel)})`);
      if (channel.guildId) {
        description.push(`[**Guild**](${guildJumplink(channel.guildId)})`);
      }
      // add when spencer adds msg fetching

      // if (channel.lastMessageId) {
      //   const route = Endpoints.Routes.MESSAGE(
      //     channel.guildId || null,
      //     channel.id,
      //     channel.lastMessageId
      //   );
      //   description.push(`[**Last Message**](${Endpoints.Routes.URL + route})`);
      // }

      embed.addField({ name: 'Urls', value: description.join(', ') });
    }
    return await editOrReply(message, embed);
  }
);
