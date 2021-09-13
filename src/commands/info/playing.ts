import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  {
    name: "playing",
    aliases: ["membersplaying"],
    description:
      "List users in the current server that is playing a certain game.",
  },
  (args) => ({ text: args.string() }),
  async (message, args) => {
    args.text = args.text.toLowerCase();
    return editOrReply(message, {
      content:
        "⚠ This command cannot be implemented yet due to Pylon limitations",
    });
  }
);
