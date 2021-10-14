import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import {
  getTag,
  putTag,
  hasTag,
  deleteTag,
  TagEmbedThumbnails
} from '../../functions/tag';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';

import config from '../../config';

commands.on(
  {
    name: 'tag-remove',
    aliases: ['t-remove'],
    description: 'Delete a tag'
  },
  (args) => ({ tag: args.string() }),
  async (message, args) => {
    if (!(await hasTag(args.tag))) {
      return await editOrReply(message, ':warning: `Tag not found`');
    }
    let tag = await getTag(args.tag);
    if (
      tag.userId !== message.author.id &&
      !config.clientOwners.includes(message.author.id) &&
      !message.member.can(discord.Permissions.MANAGE_GUILD)
    )
      return await editOrReply(
        message,
        ':warning: `You cannot delete this tag`'
      );
    await deleteTag(tag.name);
    const embed = createUserEmbed(message.author);
    embed.setColor(EmbedColors.ERROR);
    embed.setFooter({
      text: `Tag was created by ${(await discord.getUser(
        tag.userId
      ))!.getTag()}`,
      iconUrl: EmbedBrands.NOTSOBOT
    });
    embed.addField({ name: 'Old Tag Content', value: codeblock(tag.content) });
    embed.setTitle(`Removed tag ${tag.name}`);
    embed.setThumbnail({
      url: TagEmbedThumbnails['delete']
    });
    await editOrReply(message, embed);
  }
);
