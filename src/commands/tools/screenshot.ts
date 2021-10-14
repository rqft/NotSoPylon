import config from '../../config';
import { commands } from '../../globals';
import { createImageEmbed } from '../../util';
import { editOrReply } from '../../tools';
import { Parameters } from '../../parameters';
import { PxlAPI } from '../../other_apis';
commands.on(
  {
    name: 'screenshot',
    aliases: ['ss'],
    description: 'Take a screenshot of a website'
  },
  (args) => ({
    url: args.string()
  }),
  async (message, args) => {
    const url = Parameters.url(args.url, message);
    if (!url) return await editOrReply(message, ':x: `Malformed URL`');
    const image = await new PxlAPI(config.keys.pxl_api).screenshot(url);

    const embed = await createImageEmbed(image, message, 'screenshot.png');
    await editOrReply(message, embed);
  }
);
