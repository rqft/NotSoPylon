import { commands, EmbedBrands, EmbedColors } from '../../globals';
import { editOrReply } from '../../tools';
import { Parameters } from '../../parameters';
import { createUserEmbed } from '../../util';
import { codeblock } from '../../functions/markup';
interface QRScanResult {
  type: string;
  symbol: Array<{
    seq: number;
    data: string;
    error?: string;
  }>;
}
commands.on(
  {
    name: 'qr-scan'
  },
  (args) => ({
    data: args.string()
  }),
  async (message, args) => {
    const input = await Parameters.imageUrl(args.data, message);
    if (!input)
      return await editOrReply(
        message,
        ':warning: `An invalid image was provided`'
      );
    const response = await fetch(
      `http://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(
        input
      )}`
    );
    const image: QRScanResult[] = await response.json();
    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({ text: 'QR Code Scan', iconUrl: EmbedBrands.NOTSOBOT });
    embed.setDescription(
      codeblock(
        image
          .map((v) => v.symbol.map((w) => w.error || w.data).join(', '))
          .join('\n')
      )
    );
    await editOrReply(message, embed);
  }
);
