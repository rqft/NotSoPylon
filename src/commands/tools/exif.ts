import { commands, EmbedBrands, EmbedColors } from "../../globals";
import { Parameters } from "../../parameters";
import { editOrReply, formatMemory } from "../../tools";
import { createUserEmbed, getFileExtension } from "../../util";
commands.on(
  {
    name: "exif",
    description: "Get exif information from an image",
  },
  (args) => ({
    url: args.string(),
  }),
  async (context, args) => {
    const { attachment, url } = await Parameters.image(
      args.url,
      context,
      "file.gif"
    );

    const embed = createUserEmbed(context.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: "Image Exif Information",
      iconUrl: EmbedBrands.NOTSOBOT,
    });

    embed.setThumbnail({ url: url.href });
    {
      const description: Array<string> = [];
      // description.push(
      //   `**File Name**: ${attachment.filename.replace(/\.\w+$/, '')}`
      // );
      description.push(
        `**File Extension**: ${getFileExtension(attachment).toUpperCase()}`
      );

      // description.push(`**Mime Type**: ${blob.type}`);
      description.push(
        `**Dimensions**: ${attachment.width}x${attachment.height}`
      );
      description.push(`**Size**: ${formatMemory(attachment.size)}`);
      description.push(`**Attachment ID**: \`${attachment.id}\``);
      embed.setDescription(description.join("\n"));
    }

    {
      embed.addField({
        name: "Urls",
        value: `[**Image**](${attachment.url}), [**Proxy**](${attachment.proxyUrl})`,
      });
    }

    return await editOrReply(context, embed);
  }
);
