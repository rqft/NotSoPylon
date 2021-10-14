import { commands } from '../../globals';
import { editOrReply } from '../../tools';
import { escape } from '../../functions/markup';
commands.on(
  {
    name: 'reversetext',
    description: 'Reverse text'
  },
  (args) => ({ text: args.text() }),
  async (message, args) => {
    return editOrReply(
      message,
      escape.all(
        args.text
          .split('')
          .reverse()
          .join('')
      )
    );
  }
);
