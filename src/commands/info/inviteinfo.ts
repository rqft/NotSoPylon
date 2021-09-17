import {
  codeblock,
  codestring,
  escape,
  spoiler,
  url,
} from "../../functions/markup";
import {
  Colors,
  commands,
  DateOptions,
  VerificationLevelTexts,
} from "../../globals";
import { editOrReply, expandStructure, toTitleCase } from "../../tools";
import {
  channelJumplink,
  getAcronym,
  getGuildIcon,
  getLongAgoFormat,
  guildJumplink,
} from "../../util";
import * as Endpoints from "../../endpoints";
import { time } from "console";
commands.on(
  {
    name: "inviteinfo",
    description: "Get information of a discord invite",
  },
  (args) => ({
    code: args.string(),
  }),
  async (message, args) => {
    try {
      const invite = await discord.getInvite(args.code, { withCounts: true });
      const embed = new discord.Embed();
      embed.setColor(Colors.BLURPLE);
      embed.setTitle(`discord.gg/${invite.code}`);

      const guild = await invite.getGuild();
      const channel = await invite.getChannel();

      if (guild) {
        embed.setAuthor({
          name: guild.name,
          iconUrl: getGuildIcon(
            guild.id,
            guild.icon,
            guild.icon.startsWith("a_") ? "gif" : undefined
          ),
          url: guildJumplink(guild.id),
        });
      } else {
        embed.setAuthor({ name: channel.name, url: channelJumplink(channel) });
      }

      {
        const description: Array<string> = [];
        {
          const timestamp = expandStructure(channel);
          description.push(
            `**Created**: ${getLongAgoFormat(timestamp.createdAtUnix, 2)}`
          );
          description.push(
            `**->** ${spoiler(
              timestamp.createdAt.toLocaleString(undefined, DateOptions)
            )}`
          );
        }
        description.push(`**Id**: ${codestring(channel.id)}`);
        description.push(`**Name**: ${escape.all(channel.name)}`);
        description.push(`**Type**: ${channel.type}`);
        embed.addField({
          name: "Channel Information",
          value: description.join("\n"),
          inline: true,
        });
      }

      if (guild) {
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

        if (guild.description) {
          embed.setDescription(guild.description);
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
          description.push(`**Id**: ${codestring(guild.id)}`);
          description.push(
            `**Members**: ${(
              invite.approximateMemberCount || 0
            ).toLocaleString()}`
          );
          description.push(
            `**Members Online**: ${(
              invite.approximatePresenceCount || 0
            ).toLocaleString()}`
          );
          description.push(`**Name**: ${escape.all(guild.name)}`);
          if (guild.vanityUrlCode) {
            description.push(
              `**Vanity**: ${url(
                guild.vanityUrlCode,
                Endpoints.Discord.Invite.SHORT(guild.vanityUrlCode)
              )}`
            );
          }
          description.push(
            `**Verification Level**: ${
              VerificationLevelTexts[guild.verificationLevel] || "Unknown"
            }`
          );

          embed.addField({
            name: "Guild Information",
            value: description.join("\n"),
            inline: true,
          });
        }

        if (guild.features.length) {
          const description = guild.features.sort().map(toTitleCase);
          embed.addField({
            name: "Features",
            value: codeblock(description.join("\n")),
          });
        }
      }

      {
        const description: Array<string> = [];
        description.push(`[**Channel**](${channelJumplink(channel)})`);
        description.push(
          `[**Invite**](${Endpoints.Discord.Invite.SHORT(invite.code)})`
        );

        if (guild) {
          if (guild.banner) {
            description.push(`[**Banner Image**](${guild.getBannerUrl()})`);
          }
          description.push(`[**Guild**](${guildJumplink(guild.id)})`);
          if (guild.icon) {
            description.push(`[**Icon Image**](${guild.getIconUrl()})`);
          }
          if (guild.splash) {
            description.push(`[**Splash Image**](${guild.getSplashUrl()})`);
          }
        }

        embed.addField({ name: "Urls", value: description.sort().join(", ") });
      }

      return editOrReply(message, { embed });
    } catch (error) {
      let msg: string;
      if (error && error instanceof discord.ApiError && error.code === 404) {
        msg = "⚠ Unknown Invite";
      } else {
        msg = `⚠ ${error}`;
      }
      return editOrReply(message, { content: msg });
    }
  }
);
