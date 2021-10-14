import { commands } from '../../globals';
import config from '../../config';
import { editOrReply } from '../../tools';
commands.on(
  {
    name: 'say',
    description: 'Have the bot say something (owner only because exploits)',
    filters: discord.command.filters.userIdIn(config.clientOwners)
  },
  (args) => ({ text: args.text() }),
  async (message, args) => {
    return editOrReply(message, args.text);
  }
);
