import config from "../../config";
import { codeblock } from "../../functions/markup";
import { commands, EmbedBrands, EmbedColors } from "../../globals";
import { Imagga } from "../../other_apis";
import { Parameters } from "../../parameters";
import { editOrReply, formatPercentageAsBar, toTitleCase } from "../../tools";
import { createUserEmbed } from "../../util";

commands.on(
  {
    name: "labels",
  },
  (args) => ({
    url: args.string(),
  }),
  async (message, args) => {
    const image = await Parameters.imageUrl(args.url, message);
    console.log(image);
    if (!image)
      return await editOrReply(
        message,
        ":warning: `An invalid image was provided`"
      );
    const { tags } = await new Imagga(config.keys.imagga).tags(image);

    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({ text: "Image Labels", iconUrl: EmbedBrands.GOOGLE_GO });
    embed.setThumbnail({ url: image });

    {
      const description: Array<string> = [];
      for (let tag of tags.slice(0, 10)) {
        const text = toTitleCase(tag.tag.en);
        const percentage = tag.confidence.toFixed(1);
        const bar = formatPercentageAsBar(tag.confidence, { bars: 10 });
        description.push(`[${bar}] ${percentage}% - ${text}`);
      }
      embed.setDescription(
        codeblock(description.join("\n"), { language: "x1" })
      );
    }
    return await editOrReply(message, embed);
  }
);
