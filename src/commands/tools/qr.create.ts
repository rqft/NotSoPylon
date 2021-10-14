import { commands } from '../../globals';
import { createImageEmbed } from '../../util';
import { editOrReply } from '../../tools';
commands.on(
  {
    name: 'qr-create'
  },
  (args) => ({
    data: args.text()
  }),
  async (message, args) => {
    const fullFlagRegex = /-size \+$/;
    const flagRegex = /(?<=(-size ))\d+$/;
    const size = +(args.data.match(flagRegex) ?? [])[0] || 250;
    const response = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${args.data.replace(
        fullFlagRegex,
        ''
      )}`
    );
    const image = await response.arrayBuffer();
    const embed = await createImageEmbed(image, message, 'qr.png');
    await editOrReply(message, embed);
  }
);
