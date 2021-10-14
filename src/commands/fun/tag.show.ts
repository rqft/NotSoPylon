import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import { getTag, hasTag } from '../../functions/tag';
import { createTagEmbed, createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';

commands.on(
  {
    name: 'tag',
    aliases: ['t', 'tag-show', 't-show'],
    description: 'Show a tag'
  },
  (args) => ({ tag: args.string() }),
  async (message, args) => {
    if (!(await hasTag(args.tag))) {
      return await editOrReply(message, ':warning: `Tag not found`');
    }
    const tag = await getTag(args.tag);
    const embed = await createTagEmbed(message, tag);
    return editOrReply(message, embed);
  }
);
