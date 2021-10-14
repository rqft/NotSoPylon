import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import { TagEmbedThumbnails, clearTags } from '../../functions/tag';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';

import config from '../../config';

commands.on(
  {
    name: 'tag-clear',
    aliases: ['t-clear'],
    description: 'Delete all tags'
  },
  (args) => ({}),
  async (message, args) => {
    if (
      !config.clientOwners.includes(message.author.id) &&
      !message.member.can(discord.Permissions.ADMINISTRATOR)
    )
      return await editOrReply(message, ':warning: `You cannot clear tags`');
    const clear = await clearTags();
    const embed = createUserEmbed(message.author);
    embed.setColor(EmbedColors.ERROR);
    embed.setFooter({
      text: `Tag Deletion`,
      iconUrl: EmbedBrands.NOTSOBOT
    });
    embed.addField({
      name: 'Tags removed',
      value: (
        await Promise.all(
          clear.map(
            async (v) =>
              `\`${v.name} (${(await discord.getUser(v.userId))!.getTag()})\``
          )
        )
      ).join(', ')
    });
    embed.setTitle(`Cleared ${clear.length} tags`);
    embed.setThumbnail({
      url: TagEmbedThumbnails['delete']
    });
    await editOrReply(message, embed);
  }
);
