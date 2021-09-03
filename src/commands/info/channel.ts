import { Colors, commands } from "../../globals";
import * as Markup from "../../functions/markup";
import { expandStructure } from "../../tools";
commands.on(
  {
    name: "channel",
    aliases: ["channelinfo"],
    description:
      "Get information for a channel, defaults to the current channel",
  },
  (args) => ({
    payload: args.guildChannelOptional(),
  }),
  async (message, args) => {
    const channel = args.payload;
    const embed = new discord.Embed();
    embed.setAuthor({
      name: `#${channel.name}`,
      url: `https://discord.com/channels/${channel.guildId}/${channel.id}`,
    });
    {
      const description: Array<string> = [];
      description.push(
        `${channel.toMention()} ${Markup.spoiler(`(${channel.id})`)}`
      );
      if (
        channel instanceof discord.GuildTextChannel ||
        channel instanceof discord.GuildNewsChannel
      ) {
        description.push("");
        description.push(channel.topic);
      }
      embed.setDescription(description.join("\n"));
    }

    {
      const description: Array<string> = [];

      {
        const timestamp = expandStructure(channel);
        description.push(`**Created**: ${timestamp.age()}`);
        description.push(
          `**->** ${Markup.spoiler(timestamp.createdAt.toLocaleString())}`
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
      if (channel.isManaged) {
        description.push(`**Managed**: Yes`);
      }
      if (channel.parentId) {
        description.push(`**Parent**: <#${channel.parentId}>`);
        description.push(`**->** ${Markup.spoiler(`(${channel.parentId})`)}`);
      }
      if (channel.position !== undefined) {
        description.push(`**Position**: ${channel.position.toLocaleString()}`);
      }
      description.push(
        `**Type**: ${ChannelTypesText[channel.type] || "Unknown"}`
      );

      embed.addField("Information", description.join("\n"), true);
    }

    embed.setColor(Colors.BLURPLE);
  }
);
