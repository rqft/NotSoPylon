import { commands } from '../../globals';
import { SraAnimals, SRA_FACT_URL, SraAnimalsEmojis } from '../../other_apis';
import { editOrReply } from '../../tools';
commands.on(
  {
    name: 'animal-fact',
    description: 'Sends a fact of some animal'
  },
  (args) => ({
    animal: args.stringOptional({
      choices: Object.values(SraAnimals),
      default: SraAnimals.FOX
    })
  }),
  async (message, args) => {
    const text = await (await fetch(SRA_FACT_URL + args.animal)).json();
    // console.log(text);
    return await editOrReply(
      message,
      `${SraAnimalsEmojis[args.animal as SraAnimals]} \`${text.fact}\``
    );
  }
);
