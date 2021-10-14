import { commands } from '../../globals';
import { editOrReply } from '../../tools';

commands.on(
  { name: 'invite', description: 'Invite to Guild Link' },
  (_) => ({}),
  async (message) => {
    return editOrReply(message, '<https://rqft.space/nsp>');
  }
);
