import { findMember } from "../../functions/findUser";
import { commands } from "../../globals";
import { toTitleCase } from "../../tools";
import * as Markup from "../../functions/markup";
import {
  activityToTypeText,
  createUserEmbed,
  emojiToUrl,
  formatEmoji,
  formatTime,
  getElapsedTime,
  getTotalTime,
  PresenceStatusColors,
  PresenceStatusTexts,
} from "../../util";
import { Paginator } from "../../functions/paginator";

commands.on(
  {
    name: "activity",
    description: "Get a user's current activity, defaults to self",
    aliases: ["presence"],
  },
  (args) => ({ user: args.stringOptional() }),
  async (message, args) => {
    const user = await findMember(message, args.user);
    const presence = await user.getPresence();
    let activities: Array<discord.Presence.IActivity> = presence
      ? presence.activities
      : [];
    const pageLimit = activities.length || 1;
    const paginator = new Paginator(message, {
      pageLimit,
      onPage(page) {
        const embed = createUserEmbed(message.author);
        embed.setColor(PresenceStatusColors.offline);
        if (presence) {
          if (presence.clientStatus) {
            const description = [];
            for (let key of ["desktop", "web", "mobile"] as const) {
              let status = presence.clientStatus[key];
              if (status) {
                if (status in PresenceStatusTexts)
                  status = PresenceStatusTexts[status];
                description.push(`**${toTitleCase(key)}**: ${status}`);
              }
            }
            embed.addField({
              name: "Status",
              value: description.join("\n"),
            });
          } else {
            let status: string = presence.status;
            if (status in PresenceStatusTexts)
              status = PresenceStatusTexts[status];
            embed.addField({ name: "Status", value: status, inline: true });
          }

          if (presence.status in PresenceStatusColors)
            embed.setColor(PresenceStatusColors[presence.status]);

          const activityId = page - 1;
          if (activityId in activities) {
            const activity = activities[activityId];
            {
              const description: Array<string> = [];

              // add when spencer adds buttons support
              // if (activity.buttons && activity.buttons.length) {
              //   description.push(`**Buttons**: ${activity.buttons.map((button) => `\`${button}\``).join(', ')}`)
              // }

              if (activity.emoji) {
                let emoji: string;
                if (activity.emoji.id) {
                  emoji = `[${formatEmoji(activity.emoji)}](${emojiToUrl(
                    activity.emoji,
                    undefined,
                    4096
                  )})`;
                } else {
                  emoji = formatEmoji(activity.emoji);
                }
                description.push(`**Emoji**: ${emoji}`);
              }
              if (activity.type === discord.Presence.ActivityType.CUSTOM) {
                if (activity.state) {
                  description.push(
                    `**Custom Status**: ${Markup.escape.all(activity.state)}`
                  );
                } else {
                  description.push(`**Custom Status**`);
                }
                if (activity.name !== "Custom Status") {
                  description.push(
                    `**Hidden Message**: ${Markup.escape.all(
                      activity.name || ""
                    )}`
                  );
                }
              } else {
                const text = [
                  activityToTypeText(activity),
                  Markup.escape.all(activity.name || ""),
                ];
                description.push(text.filter((v) => v).join(" "));
                if (
                  activity.type === discord.Presence.ActivityType.LISTENING &&
                  !!(
                    activity.applicationId &&
                    activity.applicationId.startsWith("spotify:")
                  ) &&
                  !!activity.party.id.startsWith("spotify:")
                ) {
                  if (activity.assets && activity.assets.largeText) {
                    description.push(`**Album**: ${activity.assets.largeText}`);
                  }
                  if (activity.details) {
                    description.push(`**Song**: ${activity.details}`);
                  }
                  if (activity.state) {
                    description.push(
                      `**Artists**: ${activity.state.split("; ").join(", ")}`
                    );
                  }
                } else {
                  if (activity.details) {
                    description.push(
                      `**Details**: ${Markup.escape.all(activity.details)}`
                    );
                  }
                  if (activity.state) {
                    description.push(
                      `**State**: ${Markup.escape.all(activity.state)}`
                    );
                  }
                }
                // add when Spencer adds platform type to Presences
                // if (activity.platformType === 'samsung') {
                // description.push(`**On Samsung Galaxy**`);
                // }
                // if (activity.platformType === 'xbox') {
                // description.push("**On Xbox**");
                // }
                let name = "Actvity";
                embed.addField({
                  name,
                  value: description.join("\n"),
                  inline: true,
                });
              }

              // fields
              const thumbnail = activity.assets.largeImage;
              if (thumbnail) {
                embed.setThumbnail({ url: thumbnail });
              }

              const assets = activity.assets;
              if (assets && assets.smallText) {
                embed.setFooter({
                  text: assets.smallText,
                  iconUrl: assets.smallImage || undefined,
                });
              }

              const timestamps = activity.timestamps;
              if (timestamps) {
                const elapsed = formatTime(
                  Math.max(getElapsedTime(timestamps), 0)
                );

                const total = formatTime(getTotalTime(timestamps));

                const description = timestamps.end
                  ? `${elapsed}/${total}`
                  : `${elapsed}`;
                embed.addField({
                  name: "Time",
                  value: description,
                  inline: true,
                });
              }
              if (activity.party) {
                const description = [];
                if (activity.party.currentSize) {
                  description.push(
                    `${activity.party.currentSize}/${activity.party.maxSize} members`
                  );
                }
                if (description.length) {
                  embed.addField({
                    name: "Party",
                    value: description.join("\n"),
                  });
                }
              }
              if (
                activity.type === discord.Presence.ActivityType.LISTENING &&
                !!(
                  activity.applicationId &&
                  activity.applicationId.startsWith("spotify:")
                ) &&
                !!activity.party.id.startsWith("spotify:")
              ) {
                const description = [];
                if (activity.details) {
                  description.push(
                    `[**${activity.details}**](https://open.spotify.com/track/${activity.secrets.join})`
                  );
                } else {
                  description.push(
                    <string>(
                      `https://open.spotify.com/track/${activity.secrets.join}`
                    )
                  );
                }
                embed.addField({
                  name: "Spotify Track",
                  value: description.join("\n"),
                  inline: true,
                });
              }

              if (activity.createdAt) {
                embed.setFooter({ text: "Started" });
                embed.setTimestamp(activity.createdAt.toISOString());
              }
            }
          }
        } else {
          embed.addField({
            name: "Activity",
            value: PresenceStatusTexts["offline"],
          });
        }
        return embed;
      },
    });
    return await paginator.start();
  }
);
