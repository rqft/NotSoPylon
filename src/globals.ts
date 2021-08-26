import config from "./config";

export const commands = new discord.command.CommandGroup({
  defaultPrefix: config.prefix,
});
