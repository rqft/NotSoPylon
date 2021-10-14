import { commands } from '../../globals';
import { editOrReply } from '../../tools';
import { apiping, getLongAgoFormat } from '../../util';

commands.on(
  {
    name: 'ping',
    description: "Ping Discord's Gateway and Rest Api"
  },
  (args) => ({}),
  async (message, args) => {
    const { rest, gateway } = await apiping();
    await editOrReply(
      message,
      `pong! (rest: ${getLongAgoFormat(
        Date.now() - rest,
        2
      )}, gateway: ${getLongAgoFormat(Date.now() - gateway, 2)})`
    );
  }
);
