import { commands, PresenceStatusColors } from '../../globals';
import { defaultAvatarUrl, editOrReply } from '../../tools';
import { createUserEmbed } from '../../util';

commands.on(
  {
    name: 'avatar',
    description: 'Get the avatar for a user, defaults to self'
  },
  (args) => ({
    user: args.userOptional(),
    flags: args.stringOptional({
      choices: [
        '-default',
        '-noembed',
        '-default -noembed',
        '-noembed -default'
      ]
    })
  }),
  async (message, args) => {
    const user = args.user || message.author;
    const _default = !!args.flags;
    const avatarUrl = _default ? defaultAvatarUrl(user) : user.getAvatarUrl();
    let file: discord.Message.IOutgoingMessageAttachment | undefined;
    if (avatarUrl !== defaultAvatarUrl(user)) {
      try {
        file = {
          name: avatarUrl.split('/').pop()!,
          data: await (await fetch(user.getAvatarUrl())).arrayBuffer()
        };
      } catch (error) {}
    }
    const embed = createUserEmbed(user);
    embed.setColor(PresenceStatusColors.offline);
    const member = await (await discord.getGuild()).getMember(user.id);
    {
      const description: Array<string> = [];
      description.push(`[**Default**](${defaultAvatarUrl(user)})`);
      if (member) {
        // add when Spencer updates to Gateway v9
        // if (member.avatar) {
        //   description.push(`[**Server**](${member.getAvatarUrl()})`);
        // }
        if (member.user.avatar) {
          description.push(`[**User**](${member.user.getAvatarUrl()})`);
        }
      } else {
        if (user.avatar) {
          description.push(`[**User**](${user.getAvatarUrl()})`);
        }
      }
      embed.setDescription(description.join(', '));
    }
    if (_default) {
      embed.setImage({ url: avatarUrl });
    } else {
      const url = file ? `attachment://${file.name}` : user.getAvatarUrl();
      embed.setImage({ url });
    }
    if (member) {
      const presence = await member.getPresence();
      if (presence && presence.status in PresenceStatusColors) {
        embed.setColor(PresenceStatusColors[presence.status]);
      }
    }
    return editOrReply(message, { embed, attachments: [file!] });
  }
);
