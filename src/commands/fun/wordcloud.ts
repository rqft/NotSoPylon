import { commands } from '../../globals';
import { editOrReply } from '../../tools';
import { createImageEmbed, createUserEmbed, toUrlParams } from '../../util';
commands.on(
  {
    name: 'wordcloud',
    aliases: ['wc'],
    description: 'Creates a word cloud from some text'
  },
  (args) => ({ text: args.text() }),
  async (message, args) => {
    const img = await (
      await fetch(
        `https://quickchart.io/wordcloud${toUrlParams({
          text: args.text,
          format: 'png',
          removeStopwords: true
        })}`
      )
    ).arrayBuffer();
    const embed = await createImageEmbed(img, message);
    return editOrReply(message, embed);
  }
);
