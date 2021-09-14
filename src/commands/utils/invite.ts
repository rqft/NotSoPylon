import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  { name: "invite", description: "Invite to Guild Link" },
  (args) => ({}),
  async (message, args) => {
    return editOrReply(message, "<https://rqft.space/nsp>");
  }
);
