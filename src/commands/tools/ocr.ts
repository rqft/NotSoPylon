import config from "../../config";
import { codeblock } from "../../functions/markup";
import { commands, EmbedBrands, EmbedColors } from "../../globals";
import { Imagga } from "../../other_apis";
import { Parameters } from "../../parameters";
import { editOrReply } from "../../tools";
import { createUserEmbed } from "../../util";

commands.on(
  {
    name: "ocr",
    description: "Read text inside of an image (Optical Character Recognition)",
  },
  (args) => ({
    url: args.string(),
  }),
  async (message, args) => {
    const image = await Parameters.imageUrl(args.url, message);
    if (!image)
      return await editOrReply(
        message,
        ":warning: `An invalid image was provided`"
      );

    const { text } = await new Imagga(config.keys.imagga).text(image);
    console.log(text);
    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: "Optical Character Recognition",
      iconUrl: EmbedBrands.GOOGLE_GO,
    });
    embed.setThumbnail({ url: image });

    {
      const description: Array<string> = [];
      if (Object.keys(text).length > 0) {
        for (const key in text) {
          description.push(text[key].data);
        }
      } else {
        description.push("No Text Detected");
      }

      embed.setDescription(codeblock(description.join(", ")));
    }

    return await editOrReply(message, embed);
  }
);
