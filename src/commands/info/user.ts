import { time } from "console";
import * as exp from "constants";
import { spoiler } from "../../functions/markup";
import { Paginator } from "../../functions/paginator";
import { commands, DateOptions, PresenceStatusColors } from "../../globals";
import { Parameters } from "../../parameters";
import { editOrReply, ExpandedGuildMember, expandStructure } from "../../tools";
import { getLongAgoFormat, getMemberJoinPosition } from "../../util";

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
    const guild = await message.getGuild();
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
          const timestamp = <ExpandedGuildMember>(
            expandStructure({ ...member, id: member.user.id })
          );
          description.push(
            `**Guild**: ${getLongAgoFormat(timestamp.joinedAtUnix, 2)}`
          );
          description.push(
            `**->** ${spoiler(
              timestamp.joinedAtTimestamp.toLocaleDateString(
                undefined,
                DateOptions
              )
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
        name: "Joined",
        value: description.join("\n"),
        inline: true,
      });
    }
    if (member) {
      const description: Array<string> = [];

      if (member.premiumSince) {
        const timestamp = <ExpandedGuildMember>(
          expandStructure({ ...member, id: member.user.id })
        );
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
        .sort((x, y) => x.position - y.position)
        .map((role) => {
          if (role.guildId === role.id) {
            return `\`${role.name}\``;
          }
          return role.toMention();
        });
      let rolesText = `**Roles (${roles.length})**: ${roles.join(", ")}`;
      if (800 < rolesText.length) {
        const fromIndex = rolesText.length - (rolesText.length - 800 + 3);
        const index = rolesText.lastIndexOf(",", fromIndex);
        rolesText = rolesText.slice(0, index) + "...";
      }
      description.push(rolesText);

      const voiceState = await guild.getVoiceState(member.user.id);
      if (voiceState) {
        description.push(
          `**Voice**: ${(await voiceState.getChannel()).toMention()}`
        );
      }
      embed.addField({ name: "Guild Specific", value: description.join("\n") });
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
import {} from "node:crypto";
