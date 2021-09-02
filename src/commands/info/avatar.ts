import { commands } from "../../globals";
import { defaultAvatarUrl } from "../../tools";
import { createUserEmbed, PresenceStatusColors } from "../../util";

commands.on(
  {
    name: "avatar",
  },
  (args) => ({
    user: args.userOptional(),
    defaultFlag: args.stringOptional({
      choices: ["-default"],
    }),
  }),
  async (message, args) => {
    const { user } = args;
    const _default = !!args.defaultFlag;
    const avatarUrl = args.defaultFlag
      ? defaultAvatarUrl(user)
      : user.getAvatarUrl();
    let file: discord.Message.IOutgoingMessageAttachment | undefined;
    if (avatarUrl !== defaultAvatarUrl(user)) {
      try {
        file = {
          name: avatarUrl.split("/").pop()!,
          data: await (await fetch(user.getAvatarUrl())).arrayBuffer(),
        };
      } catch (error) {}
    }
    const embed = createUserEmbed(user);
    embed.setColor(PresenceStatusColors.offline);
    {
      const description: Array<string> = [];
      description.push(`[**Default**](${defaultAvatarUrl(user)})`);
      if (user instanceof discord.GuildMember) {
        if (user.avatar) {
          description.push(`[**Server**](${user.getAvatarUrl()})`);
        }
        if (user.user.avatar) {
          description.push(`[**User**](${user.user.getAvatarUrl()})`);
        }
      } else {
        if (user.avatar) {
          description.push(`[**User**](${user.getAvatarUrl()})`);
        }
      }
      embed.setDescription(description.join(", "));
    }
  }
);
