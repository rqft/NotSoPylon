import { codeblock } from "../../functions/markup";
import { commands, EmbedColors } from "../../globals";
import { editOrReply, toTitleCase } from "../../tools";
import { createUserEmbed } from "../../util";
interface CommandExecutor {
  options: discord.command.ICommandOptions;
  parser: Function;
  argumentConfigList: Array<[string, { type: string; options?: string }]>;
  filter: {
    filterFn: Function;
    criteriaFn: Function;
  };
  aliases: Set<string>;
}
type CommandExecutors = Map<
  string,
  { executor: CommandExecutor; aliasOf?: string }
>;
function getCommand(content: string) {
  const cmds: CommandExecutors = (commands as any).commandExecutors;
  const found = Array.from(cmds.entries()).find(([_, v]) =>
    [...(v.executor.options.aliases ?? []), v.executor.options.name].some(
      (n) =>
        n.toLowerCase().includes(content.toLowerCase()) ||
        n.toLowerCase() === content.toLowerCase()
    )
  );
  if (!found) return undefined;
  return found[1];
}
commands.on(
  { name: "help", description: "Help!" },
  (args) => ({ command: args.stringOptional() }),
  async (message, args) => {
    if (!args.command)
      return editOrReply(
        message,
        "This is a NotSoBot clone written in Pylon. (Join our support server <https://rqft.space/nsp>)"
      );
    const cmd = getCommand(args.command);
    if (!cmd) return await editOrReply(message, ":warning: `Unknown Command`");
    const embed = createUserEmbed(message.author);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setTitle(toTitleCase(cmd.executor.options.name));
    embed.setDescription(
      cmd.executor.options.description ?? "idk this isnt finished yet"
    );
    if (cmd.executor.aliases.size) {
      embed.addField({
        name: "Aliases",
        value: Array.from(cmd.executor.aliases).join(", "),
        inline: true,
      });
    }
    const usage = cmd.executor.argumentConfigList.map(([name, { type }]) => {
      const optional = type.endsWith("Optional");
      const brackets = {
        left: optional ? "(" : "<",
        right: optional ? ")" : ">",
      };
      return `${brackets.left}${name}: ${type}${brackets.right}`;
    });
    embed.addField({
      name: "Usage",
      value: codeblock(
        `${(commands as any).options.defaultPrefix}${
          cmd.executor.options.name
        } ${usage.join(" ")}`
      ),
    });
    return await editOrReply(message, embed);
  }
);
