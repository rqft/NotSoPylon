import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  {
    name: "memoryusage",
    description: "Show the bot's current memory usage",
  },
  (args) => ({}),
  async (message, args) => {
    return await editOrReply(
      message,
      "unimplemented since pylon isnt run on regular node stuff"
    );
  }
);
