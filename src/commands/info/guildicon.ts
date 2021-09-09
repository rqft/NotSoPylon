import { commands } from "../../globals";

commands.on(
  {
    name: "guildicon",
    description: "Get the icon for a guild, defaults to the current guild",
  },
  (args) => ({}),
  async (message, args) => {
    const guild = await discord.getGuild();
    if (guild.icon) {
      const url = guild.getIconUrl() as string;

      const channel = await message.getChannel();
      if (channel && channel.canMember()) {
        const embed = new Embed();
        embed.setAuthor(guild.name, url, guild.jumpLink);
        embed.setColor(Colors.BLURPLE);
        embed.setDescription(`[**Icon Url**](${guild.iconUrl})`);
        embed.setImage(url);

        return editOrReply(context, { embed });
      }
      return editOrReply(context, url);
    }
    return editOrReply(context, "Guild doesn't have an icon.");
  }
);
