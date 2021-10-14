import { commands } from '../../globals';
import { editOrReply } from '../../tools';
import { createImageEmbed } from '../../util';
import { Parameters } from '../../parameters';
commands.on(
  {
    name: 'emoji',
    aliases: ['e'],
    description: 'View Emojis'
  },
  (args) => ({ emoji: args.string() }),
  async (message, args) => {
    const emoji = Parameters.emoji(args.emoji, message);
    if (!emoji) return await editOrReply(message, ':warning: `Unknown Emoji`');
    const embed = await createImageEmbed(emoji.url, message);

    return editOrReply(message, embed);
  }
);
