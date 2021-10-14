import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  {
    name: "shards",
    description: "Show all of the bot's shard information",
  },
  (args) => ({}),
  async (message, args) => {
    return await editOrReply(
      message,
      "unimplemented since i do not store cmds"
    );
  }
);
