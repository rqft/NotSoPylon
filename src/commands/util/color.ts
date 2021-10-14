import { commands } from '../../globals';
import { Parameters } from '../../parameters';
import { editOrReply, intToRGB, rgbToHsl } from '../../tools';
import { createColorUrl, createImageEmbed } from '../../util';

commands.on(
  {
    name: 'color'
  },
  (args) => ({
    color: args.string(),
    size: args.numberOptional({ default: 250, maxValue: 1000, minValue: 2 })
  }),
  async (message, args) => {
    const color = Parameters.color(args.color, message);
    if (color === undefined)
      return await editOrReply(
        message,
        `:warning: \`Invalid Color Code '${args.color}'\``
      );
    const colorUrl = createColorUrl(color, args.size);
    const imgEmbed = await createImageEmbed(colorUrl, message, 'color.png');
    {
      const description: Array<string> = [];
      description.push(
        `**Color**: [#${color
          .toString(16)
          .padStart(6, '0')
          .toUpperCase()}](${colorUrl})`
      );
      const rgb = Object.values(intToRGB(color)) as [number, number, number];
      const hsl = Object.values(rgbToHsl(...rgb));
      description.push(`**Decimal**: ${color.toString(10)}`);
      description.push(`**RGB**: (${rgb.join(', ')})`);
      description.push(`**HSL**: (${hsl.join(', ')})`);

      imgEmbed.setDescription(description.join('\n'));
    }
    await editOrReply(message, imgEmbed);
  }
);
