import { findMember } from "../functions/findUser";
import { commands } from "../globals";
import { createUserEmbed, PresenceStatusColors } from "../util";

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
  }
);
