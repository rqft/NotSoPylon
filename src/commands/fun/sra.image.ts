import { commands } from '../../globals';
import {
  SraAnimals,
  SRA_IMAGE_URL,
  SraAnimalsEmojis,
  SraAnimalsText
} from '../../other_apis';
import { editOrReply } from '../../tools';
import { createImageEmbed } from '../../util';
commands.on(
  {
    name: 'animal-image',
    aliases: ['animal'],
    description: 'Sends a random image of some animal'
  },
  (args) => ({
    animal: args.stringOptional({
      choices: Object.values(SraAnimals),
      default: SraAnimals.FOX
    })
  }),
  async (message, args) => {
    const img = await (await fetch(SRA_IMAGE_URL + args.animal)).json();
    const embed = await createImageEmbed(img.link, message);
    embed.setDescription(
      `${SraAnimalsEmojis[args.animal as SraAnimals]} Have a ${
        SraAnimalsText[args.animal as SraAnimals]
      } image`
    );
    return await editOrReply(message, embed);
  }
);
