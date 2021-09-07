import { commands } from "../../globals";

commands.on(
  {
    name: "guild",
    aliases: ["guildinfo", "server", "serverinfo"],
    description: "Get information for a guild, defaults to the current guild",
  },
  (args) => ({
    guild: args.stringOptional(),
  }),
  async (message, args) => {
    const { guild } = args;
  }
);
