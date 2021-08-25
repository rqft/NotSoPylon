import { infoCommands } from "./commands/info";
import { NotSoClient, NotSoCommand } from "./internals/client";
const testCommand = (message: discord.GuildMemberMessage) => {
  message.inlineReply("ok done");
};
const commands: NotSoCommand[] = [
  { name: "test", run: testCommand },
  { name: "test", group: "other", run: testCommand },
  ...infoCommands,
];

new NotSoClient({
  commands,
  prefixes: [".", ".."],
});
