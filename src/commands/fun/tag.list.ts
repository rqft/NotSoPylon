import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import {
  getTag,
  hasTag,
  listTags,
  TagEmbedThumbnails
} from '../../functions/tag';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';
import { Parameters } from '../../parameters';

commands.on(
  {
    name: 'tag-list',
    aliases: ['t-list'],
    description: "List a user's tags, or the entire server's"
  },
  (args) => ({ user: args.stringOptional() }),
  async (message, args) => {
    const user = await Parameters.user(message, args.user ?? undefined);
    if (!user) return await editOrReply(message, ':warning: `User not found`');
    if (user.bot)
      return await editOrReply(message, ':warning: `Bots cannot have tags`');
    const list = await listTags(args.user ? user.id : undefined);
    if (!list.length) {
      const person = args.user
        ? user.id === message.author.id
          ? 'You'
          : user.getTag()
        : 'This server';
      const pronoun = `${person} do${
        person !== 'You' ? 'es' : ''
      } not have any tags here`;
      return await editOrReply(message, pronoun);
    }
    const titlePerson = args.user
      ? user.id === message.author.id
        ? 'your'
        : `${user.username}'s`
      : "this server's";
    const embed = createUserEmbed(message.author);
    embed.setTitle(`Listing ${titlePerson} tags`);
    embed.setDescription(list.map((v) => `\`${v.name}\``).join(', '));
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: `Tag List`,
      iconUrl: EmbedBrands.NOTSOBOT
    });
    embed.setThumbnail({
      url: TagEmbedThumbnails['list']
    });
    return editOrReply(message, embed);
  }
);
