import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import {
  getTag,
  putTag,
  hasTag,
  TagEmbedThumbnails
} from '../../functions/tag';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';

commands.on(
  {
    name: 'tag-create',
    aliases: ['t-create', 'tag-add', 't-add'],
    description: 'Create a tag'
  },
  (args) => ({ tag: args.string(), content: args.text() }),
  async (message, args) => {
    if (await hasTag(args.tag)) {
      return await editOrReply(message, ':warning: `Tag already exists`');
    }

    const tag = await putTag({
      content: args.content,
      userId: message.author.id,
      name: args.tag
    });
    const embed = createUserEmbed(message.author);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: `Tag created by ${(await discord.getUser(tag.userId))!.getTag()}`,
      iconUrl: EmbedBrands.NOTSOBOT
    });
    embed.addField({ name: 'Old Tag Content', value: codeblock(tag.content) });
    embed.setTitle(`Created tag ${tag.name}`);
    embed.setThumbnail({
      url: TagEmbedThumbnails['create']
    });
    return editOrReply(message, embed);
  }
);
