import { Colors, commands } from '../../globals';
import { editOrReply } from '../../tools';
import { guildJumplink } from '../../util';

commands.on(
  {
    name: 'guildicon',
    description: 'Get the icon for a guild, defaults to the current guild'
  },
  (_) => ({}),
  async (message) => {
    const guild = await discord.getGuild();
    if (guild.icon) {
      const iconUrl = guild.getIconUrl() as string;

      const channel = await message.getChannel();
      if (
        channel &&
        channel.canMember(
          (await guild.getMember(discord.getBotId()))!,
          discord.Permissions.EMBED_LINKS
        )
      ) {
        const embed = new discord.Embed();
        embed.setAuthor({
          name: guild.name,
          iconUrl,
          url: guildJumplink(guild.id)
        });
        embed.setColor(Colors.BLURPLE);
        embed.setDescription(`[**Icon Url**](${guild.getIconUrl()})`);
        embed.setImage({ url: iconUrl });

        return editOrReply(message, { embed });
      }
      return editOrReply(message, { content: iconUrl });
    }
    return editOrReply(message, { content: "Guild doesn't have an icon." });
  }
);
