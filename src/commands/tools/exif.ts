import { commands, EmbedBrands, EmbedColors } from "../../globals";
import { editOrReply, getUrlExtension } from "../../tools";
import { Parameters } from "../../parameters";
import { createUserEmbed, formatTime, getFileExtension } from "../../util";
import { env } from "process";
commands.on(
  {
    name: "exif",
    description: "Get exif information from an image",
  },
  (args) => ({
    image: args.stringOptional(),
  }),
  async (message, args) => {
    const image = await Parameters.image(args.image, message);
    const isGif = getUrlExtension(image.url) === discord.ImageType.GIF;
    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: "Image Exif Information",
      iconUrl: EmbedBrands.NOTSOBOT,
    });

    {
      const;
    }
  }
);
