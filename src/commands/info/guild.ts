import { spoiler } from "../../functions/markup";
import { Colors, commands } from "../../globals";
import { expandStructure, guildIdToShardId } from "../../tools";
import {
  asyncIteratorToArray,
  getAcronym,
  guildHasPublic,
  guildJumplink,
  preferredLocaleText,
} from "../../util";

commands.on(
  {
    name: "guild",
    aliases: ["guildinfo", "server", "serverinfo"],
    description: "Get information for a guild, defaults to the current guild",
  },
  (args) => ({}),
  async (message, args) => {
    const guild = await discord.getGuild();
    const channels = await guild.getChannels();
    const emojis = await guild.getEmojis();
    const {
      memberCount,
      ownerId,
      // presenceCount
    } = guild;
    const voiceStateCount = asyncIteratorToArray(guild.iterVoiceStates());
    const owner = (await guild.getMember(ownerId))!;

    const embed = new discord.Embed();
    embed.setAuthor({
      name: guild.name,
      iconUrl: guild.getIconUrl() || undefined,
      url: guildJumplink(guild.id),
    });
    embed.setColor(Colors.BLURPLE);

    if (guild.vanityUrlCode) {
      embed.setFooter({ text: `https://discord.gg/${guild.vanityUrlCode}` });
    }
    if (guild.description) {
      embed.setDescription(guild.description);
    }
    if (guild.banner) {
      embed.setThumbnail({ url: guild.getBannerUrl() });
    } else {
      if (guild.icon) {
        embed.setThumbnail({ url: guild.getIconUrl() });
      }
    }
    if (guild.splash) {
      embed.setImage({ url: guild.getSplashUrl() });
    }
    {
      const description: Array<string> = [];

      description.push(`**Acronym**: ${getAcronym(guild.name)}`);
      {
        const timestamp = expandStructure(guild);
        description.push(`**Created**: ${timestamp.age()}`);
        description.push(
          `**->** ${spoiler(timestamp.createdAt.toLocaleString())}`
        );
      }
      description.push(`**Id**: \`${guild.id}\``);
      description.push(
        `**Locale**: \`${preferredLocaleText(guild) || guild.preferredLocale}\``
      );
      description.push(
        `**Nitro Tier**: ${
          guild.premiumTier ? `Level ${guild.premiumTier}` : "None"
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
        `**Server Type**: ${guildHasPublic(guild) ? "Public" : "Private"}`
      );

      description.push(`**Shard Id**: \`${guildIdToShardId(guild.id)}\``);
      // Application Id
      // large
      // lazy
      // system channel flags

      embed.addField({
        name: "Information",
        value: description.join("\n"),
        inline: true,
      });
    }
  }
);
