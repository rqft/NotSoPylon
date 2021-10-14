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

import config from '../../config';

commands.on(
  {
    name: 'tag-edit',
    aliases: ['t-edit'],
    description: 'Edit a tag'
  },
  (args) => ({ tag: args.string(), content: args.text() }),
  async (message, args) => {
    if (!(await hasTag(args.tag))) {
      return await editOrReply(message, ':warning: `Tag not found`');
    }
    let tag = await getTag(args.tag);
    if (
      tag.userId !== message.author.id &&
      !config.clientOwners.includes(message.author.id)
    )
      return await editOrReply(message, ":warning: `You don't own this tag`");
    if (tag.content === args.content)
      return await editOrReply(
        message,
        ':warning: `Tag already has that content`'
      );
    let before = tag.content.slice(0, 500);
    tag = await putTag({
      name: tag.name,
      userId: tag.userId,
      content: args.content
    });
    let after = tag.content.slice(0, 500);

    const embed = createUserEmbed(message.author);
    embed.setTitle(`Edited tag ${tag.name}`);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: `Tag created by ${(await discord.getUser(tag.userId))!.getTag()}`,
      iconUrl: EmbedBrands.NOTSOBOT
    });
    embed.setFields([
      { name: 'Old Content', value: codeblock(before) },
      { name: 'New Content', value: codeblock(after) }
    ]);
    embed.setThumbnail({
      url: TagEmbedThumbnails['edit']
    });
    await editOrReply(message, embed);
  }
);
