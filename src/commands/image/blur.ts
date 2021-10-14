import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply, formatMemory } from '../../tools';
import { Parameters } from '../../parameters';
import { createImageEmbed, getFileExtension, toUrlParams } from '../../util';
import { PxlAPI } from '../../other_apis';
import config from '../../config';
commands.on(
  {
    name: 'blur',
    description: 'Blur an image'
  },
  (args) => ({
    url: args.string()
  }),
  async (context, args) => {
    const imageUrl = await Parameters.imageUrl(args.url, context);
    if (!imageUrl)
      return await editOrReply(context, `:warning: \`Invalid Image\``);
    const image = await (
      await fetch(
        `https://rqft.imgix.net/${encodeURIComponent(imageUrl)}${toUrlParams({
          S: config.keys.imgix,
          blur: 50
        })}`
      )
    ).arrayBuffer();
    const embed = await createImageEmbed(image, context);
    return await editOrReply(context, embed);
  }
);
