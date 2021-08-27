import { findMember } from "../functions/findUser";
import { commands } from "../globals";
import { toTitleCase } from "../tools";
import {
  createUserEmbed,
  PresenceStatusColors,
  PresenceStatusTexts,
} from "../util";

commands.on(
  "activity",
  (args) => ({ user: args.stringOptional() }),
  async (message, args) => {
    const user = await findMember(message, args.user);
    const presence = await user.getPresence();
    let activities: Array<discord.Presence.IActivity> = presence
      ? presence.activities
      : [];
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
        embed.addField({ name: "Status", value: description.join("\n") });
      } else {
        let status: string = presence.status;
        if (status in PresenceStatusTexts) status = PresenceStatusTexts[status];
        embed.addField({ name: "Status", value: status, inline: true });
      }

      if (presence.status in PresenceStatusColors)
        embed.setColor(PresenceStatusColors[presence.status]);

      for (const activity of activities) {
      }
    }
  }
);
