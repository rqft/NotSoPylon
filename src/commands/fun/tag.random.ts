import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import { getTag, hasTag, randomTag } from '../../functions/tag';
import { createTagEmbed, createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';

commands.on(
  {
    name: 'tag-random',
    aliases: ['t-random'],
    description: 'Show a random tag'
  },
  (args) => ({}),
  async (message) => {
    const tag = await randomTag();
    const embed = await createTagEmbed(message, tag);
    return editOrReply(message, embed);
  }
);
