export class NotSoClient {
  private _commandGroup: discord.command.CommandGroup;
  constructor(commands: NotSoCommand[]) {
    this._commandGroup = new discord.command.CommandGroup();
    commands.forEach((v) => {
      this._commandGroup.on({
        name: (v.prefix || "") + v.name,
        description: v.description ?? "good luck",
        aliases: v.aliases ?? [],
      });
    });
  }
}
export interface NotSoCommand<
  Args extends { [key: string]: discord.command.CommandArgumentTypes } = {}
> {
  args?: IArgument;
  name: string;
  aliases?: Array<string>;
  prefix?: string;
  description?: string;
  run: (
    message: discord.GuildMemberMessage,
    args: discord.command.ResolvedArgs<Args>
  ) => any;
}
export interface IArgument<T> {
  name: string;
  type: discord.command.ArgumentType;
  description?: string;
  default?: T;
  choices?: string[] | number[];
  minValue?: number;
  maxValue?: number;
}
