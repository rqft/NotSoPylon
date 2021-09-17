import { createHash, createHmac } from "crypto";
import { codeblock } from "../../functions/markup";
import { commands, EmbedBrands, EmbedColors } from "../../globals";
import { editOrReply, toTitleCase } from "../../tools";
import { createUserEmbed } from "../../util";
export enum HashTypes {
  MD4 = "MD4",
  MD5 = "MD5",
  SHA = "SHA",
  SHA1 = "SHA1",
  SHA224 = "SHA224",
  SHA256 = "SHA256",
  SHA384 = "SHA384",
  SHA512 = "SHA512",
  WHIRLPOOL = "WHIRLPOOL",
}
commands.on(
  {
    name: "hash",
    description: "Hash some text, uses MD5 by default",
  },
  (args) => ({
    text: args.string(),
    use: args.stringOptional({
      choices: Object.values(HashTypes),
      default: HashTypes.MD5,
    }),
    secret: args.stringOptional(),
  }),
  async (message, args) => {
    // const algorithm = (args.use || HashTypes.MD5).toLowerCase();
    // const title = toTitleCase(algorithm);
    // let digest: string;
    // if (args.secret) {
    // const hmac = createHmac(algorithm, args.secret);
    //   hmac.update(args.text);
    //   digest = hmac.digest("hex");
    // } else {
    //   const hash = createHash(algorithm);
    //   hash.update(args.text);
    //   digest = hash.digest("hex");
    // }
    const embed = createUserEmbed(message.member.user);
    embed.setDescription(codeblock("Unable to use module 'node:crypto'"));
    // embed.setColor(EmbedColors.DEFAULT);
    // embed.setFooter({
    //   text: `${title} ${args.secret ? "HMAC" : "Hash"}`,
    //   iconUrl: EmbedBrands.NOTSOBOT,
    // });

    // embed.setDescription(codeblock(args.text));
    // if (args.secret) {
    //   embed.addField({ name: "Secret Key", value: codeblock(args.secret) });
    // }
    // embed.addField({ name: "Result", value: codeblock(digest) });
    embed.setColor(EmbedColors.ERROR);
    embed.setFooter({
      iconUrl: EmbedBrands.NOTSOBOT,
      text: "NotSoPylon Error",
    });

    return await editOrReply(message, embed);
  }
);
