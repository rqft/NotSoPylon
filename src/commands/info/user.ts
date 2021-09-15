import { spoiler } from "../../functions/markup";
import { Paginator } from "../../functions/paginator";
import { commands, DateOptions, PresenceStatusColors } from "../../globals";
import { Parameters } from "../../parameters";
import { expandStructure } from "../../tools";
import { getLongAgoFormat } from "../../util";

commands.on(
  {
    name: "user",
    aliases: ["userinfo", "member", "memberinfo"],
    description: "Get information about a user, defaults to self",
  },
  (args) => ({
    user: args.string(),
  }),
  async (message, args) => {
    const member = await Parameters.member(message, args.user);
    const user = await Parameters.user(message, args.user);
    const isMember = !!member;
    const embed = new discord.Embed();
    embed.setAuthor({ name: user.getTag(), iconUrl: user.getAvatarUrl() });
    embed.setColor(PresenceStatusColors["offline"]);
    embed.setDescription(user.toMention());
    embed.setThumbnail({ url: user.getAvatarUrl() });
    {
      const description: Array<string> = [];
      // {
      //   const badges: Array<string> = [];
      //   for (let key in DiscordEmojis.DISCORD_BADGES) {
      //     if (user.hasFlag(parseInt(key))) {
      //       badges.push((DiscordEmojis.DISCORD_BADGES as any)[key]);
      //     }
      //   }
      //   if (badges.length) {
      //     description.push(`**Badges**: ${badges.join(" ")}`);
      //   }
      // }
      // if (userWithBanner.accentColor !== null) {
      //   const color = intToRGB(userWithBanner.accentColor);
      //   const hex = Markup.codestring(
      //     intToHex(userWithBanner.accentColor, true)
      //   );
      //   const rgb = Markup.codestring(`(${color.r}, ${color.g}, ${color.b})`);
      //   description.push(`**Banner Color**: ${hex} ${rgb}`);
      // }
      description.push(`**Bot**: ${user.bot ? "Yes" : "No"}`);
      description.push(`**Id**: \`${user.id}\``);
      //   if (user.system) {
      //     description.push(`**System**: Yes`);
      //   }
      //   {
      //     let tag: string | undefined;
      //     if (user.system) {
      //       tag = DiscordEmojis.DISCORD_TAG_SYSTEM;
      //     } else if (user.bot) {
      //       if (user.hasVerifiedBot) {
      //         tag = DiscordEmojis.DISCORD_TAG_BOT;
      //       } else {
      //         tag = DiscordEmojis.DISCORD_TAG_BOT;
      //       }
      //     }
      //     if (tag) {
      //       description.push(`**Tag**: ${tag}`);
      //     }
      //   }
      embed.addField({
        name: "Information",
        value: description.join("\n"),
        inline: true,
      });
    }

    {
      const description: Array<string> = [];
      {
        const timestamp = expandStructure(user);
        description.push(
          `**Discord**: ${getLongAgoFormat(timestamp.createdAtUnix, 2)}`
        );
        description.push(
          `**->** ${spoiler(
            timestamp.createdAt.toLocaleDateString(undefined, DateOptions)
          )}`
        );
      }
      if (isMember && new Date(member.joinedAt)) {
        {
          const timestamp = createTimestampMomentFromGuild(
            member.joinedAtUnix,
            context.guildId
          );
          description.push(`**Guild**: ${timestamp.fromNow()}`);
          description.push(
            `**->** ${Markup.spoiler(timestamp.format(DateMomentLogFormat))}`
          );
        }

        if (member.guild) {
          const [position, memberCount] = getMemberJoinPosition(
            member.guild,
            member.id
          );
          description.push(
            `**Join Position**: ${position.toLocaleString()}/${memberCount.toLocaleString()}`
          );
        }
      }
      embed.addField("Joined", description.join("\n"), true);
    }
  }
);
