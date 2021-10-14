import { AsciiFonts, commands, EmbedBrands, EmbedColors } from '../../globals';
import config from '../../config';
import { editOrReply } from '../../tools';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';
commands.on(
  {
    name: 'ascii',
    description: 'Convert text to an ASCII Image'
  },
  (args) => ({ text: args.text() }),
  async (message, args) => {
    const fullFlagRegex = /-font \w+$/;
    const flagRegex = /(?<=(-font ))\w+$/;
    const [font] = args.text.match(flagRegex) ?? [''];
    if (font && !AsciiFonts.includes(font)) {
      return await editOrReply(
        message,
        `:warning: \`Invalid value for argument 'flag', valid choices: [${AsciiFonts.join(
          ', '
        )}]\``
      );
    }
    const ascii = await (
      await fetch(
        `https://artii.herokuapp.com/make?text=${args.text.replace(
          fullFlagRegex,
          ''
        )}${font ? `&font=${font}` : ''}`
      )
    ).text();
    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({ text: 'ASCII Art', iconUrl: EmbedBrands.NOTSOBOT });
    embed.setDescription(
      codeblock(ascii.length > 1000 ? args.text : ascii, { language: 'fix' })
    );
    return editOrReply(message, embed);
  }
);
