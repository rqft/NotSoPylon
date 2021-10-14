import {
  commands,
  PresenceStatusColors,
  PresenceStatusTexts,
  Statuses
} from '../../globals';
import { editOrReply, toTitleCase } from '../../tools';
import * as Markup from '../../functions/markup';
import {
  activityToTypeText,
  asyncIteratorToArray,
  createUserEmbed,
  emojiToUrl,
  formatEmoji,
  formatTime,
  getElapsedTime,
  getTimeline,
  getTotalTime
} from '../../util';

import { Paginator } from '../../functions/paginator';
import { Parameters } from '../../parameters';
enum ActivityType {
  GAME = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4
}
function activityIsOnSpotify(activity: discord.Presence.IActivity) {
  return (
    activity.type === discord.Presence.ActivityType.LISTENING &&
    activity.party &&
    activity.party.id &&
    activity.party.id.startsWith('spotify:')
  );
}

commands.on(
  {
    name: 'activity',
    description: "Get a user's current activity, defaults to self",
    aliases: ['presence']
  },
  (c) => ({ user: c.stringOptional() }),
  async (message, _args) => {
    const args = _args as discord.command.ResolvedArgs<{
      user: string;
    }>;
    const user = await Parameters.member(message, args.user);
    const presence = await user.getPresence();
    let activities: Array<discord.Presence.IActivity> = presence
      ? presence.activities
      : [];

    const embed = createUserEmbed(user.user);
    embed.setColor(PresenceStatusColors.offline);

    if (presence.clientStatus) {
      const description: Array<string> = [];
      for (let key of ['desktop', 'web', 'mobile'] as const) {
        let status = (presence.clientStatus[key] as unknown) as Statuses;
        let statusText;
        if (status && status !== Statuses.OFFLINE) {
          statusText = toTitleCase(PresenceStatusTexts[status]);
          description.push(`**${toTitleCase(key)}**: ${statusText}`);
        }
      }
      embed.addField({
        name: 'Status',
        value: description.length ? description.join('\n') : '**Web**: Offline'
      });
    } else {
      let status: string = presence.status;
      if (status in PresenceStatusTexts)
        status = PresenceStatusTexts[status as Statuses];
      embed.addField({ name: 'Status', value: status, inline: true });
    }

    if (presence.status in PresenceStatusColors)
      embed.setColor(PresenceStatusColors[presence.status]);

    for (let activityId in activities) {
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
          if (activity.name !== 'Custom Status') {
            description.push(
              `**Hidden Message**: ${Markup.escape.all(activity.name || '')}`
            );
          }
        } else {
          const text = [
            activityToTypeText(activity),
            Markup.escape.all(activity.name)
          ];
          description.push(text.filter((v) => v).join(' '));
          if (activityIsOnSpotify(activity)) {
            if (activity.assets && activity.assets.largeText) {
              description.push(`**Album**: ${activity.assets.largeText}`);
            }
            if (activity.details) {
              description.push(`**Song**: ${activity.details}`);
            }
            if (activity.state) {
              description.push(
                `**Artists**: ${activity.state.split('; ').join(', ')}`
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
        }
        embed.addField({ name: 'Activity', value: description.join('\n') });

        const timestamps = activity.timestamps;
        if (timestamps) {
          const elapsed = formatTime(Math.max(getElapsedTime(timestamps), 0));

          const total = formatTime(getTotalTime(timestamps));

          const timeBar = getTimeline(timestamps, 15);
          embed.addField({
            name: 'Time',
            value: `\`${elapsed} [${timeBar}] ${
              timestamps.end ? total : '0:00'
            }\``,
            inline: true
          });
        }
        if (activity.party) {
          console.log(activity.party);
          const group = (
            await Promise.all(
              (
                await asyncIteratorToArray(
                  (await message.getGuild()).iterMembers()
                )
              ).map((v) => v.getPresence())
            )
          )
            .filter((v) =>
              v.activities.some(
                (v) => v.party && v.party.id === activity.party!.id
              )
            )
            .map((v) => `<@${v.userId}>`);

          const description = [];
          if (activity.party.currentSize) {
            description.push(
              `${activity.party.currentSize}/${activity.party.maxSize} members`
            );
          }
          if (group.length) {
            description.push(
              `**Group (${group.length})**: ${group.join(', ')}`
            );
          }
          if (description.length) {
            embed.addField({
              name: 'Party',
              value: description.join('\n')
            });
          }
        }
        if (activity.secrets) {
          const description: Array<string> = [];
          for (let key in activity.secrets) {
            if (key)
              description.push(
                `**${toTitleCase(key)}**: ${Markup.spoiler(
                  activity.secrets[
                    key as keyof discord.Presence.IActivitySecrets
                  ]!
                )}`
              );
          }
        }

        if (activity.createdAt) {
          embed.setFooter({ text: 'Started' });
          embed.setTimestamp(activity.createdAt.toISOString());
        }
      }
    }

    return await editOrReply(message, embed);
  }
);
