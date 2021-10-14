import { commands, EmbedBrands, EmbedColors } from '../../globals';
import config from '../../config';
import { editOrReply } from '../../tools';
import { codeblock } from '../../functions/markup';
commands.on(
  {
    name: 'eval',
    description: 'Eval some code',
    filters: discord.command.filters.userIdIn(config.clientOwners)
  },
  (args) => ({ code: args.text() }),
  async (context, args) => {
    const { code } = args;

    let language = 'js';
    let message: any;
    let errored: boolean = false;
    try {
      const ctx = context; // i want the eval to have access to this !
      message = await Promise.resolve(
        eval(`(async () => {
          ${code}
        })()`)
      );

      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
        language = 'json';
      }
    } catch (error) {
      message = error ? error.stack || error.message : error;
      errored = true;
    }

    let content: string = String(message);

    const embed = new discord.Embed();
    if (errored) {
      embed.setColor(EmbedColors.ERROR);
    } else {
      embed.setColor(EmbedColors.DEFAULT);
    }
    embed.setDescription(codeblock(content, { language, mentions: false }));
    embed.setFooter({ text: 'Eval', iconUrl: EmbedBrands.NOTSOBOT });

    return editOrReply(context, { embed });
  }
);
