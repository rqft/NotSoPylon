export class NotSoClient<
  T extends { [key: string]: discord.command.CommandArgumentTypes }
> {
  private _commandGroup: discord.command.CommandGroup;
  private _options: NotSoClientOptions<T>;
  private _commands: NotSoCommand<T>[];
  private _prefixes: string[];
  constructor(options: NotSoClientOptions<T>) {
    this._options = options;
    this._prefixes = [this._options.prefix, ...this._options.prefixes];
    this._commandGroup = new discord.command.CommandGroup({
      mentionPrefix: this._options.mentionPrefix,
      defaultPrefix: this._prefixes[0] ?? ".",
      additionalPrefixes: this._prefixes,
    });
    this._commands = this._options.commands ?? [];

    this._commands
      .filter((v) => v.group === undefined)
      .forEach((v) => {
        this._commandGroup.on(
          {
            name: (v.prefix || "") + v.name,
            description: v.description ?? "good luck",
            aliases: v.aliases ?? [],
          },
          v.args,
          v.run
        );
      });
    this._commands
      .map((v) => v.group)
      .filter((v) => v !== null)
      .forEach((group) => {
        this._commandGroup.subcommand(group, (g) => {
          this._commands
            .filter((v) => v.group !== undefined)
            .forEach((v) => {
              g.on(
                {
                  name: (v.prefix || "") + v.name,
                  description: v.description ?? "good luck",
                  aliases: v.aliases ?? [],
                },
                v.args,
                v.run
              );
            });
        });
      });
  }
}
export interface NotSoClientOptions<
  T extends { [key: string]: discord.command.CommandArgumentTypes }
> {
  commands?: NotSoCommand<T>[];
  prefix?: string;
  prefixes?: string[];
  mentionPrefix?: boolean;
}

export interface NotSoCommand<
  T extends { [key: string]: discord.command.CommandArgumentTypes }
> {
  group?: string;
  args?: discord.command.ArgumentsParser<T>;
  name: string;
  aliases?: Array<string>;
  prefix?: string;
  description?: string;
  run: (
    message: discord.GuildMemberMessage,
    args: discord.command.ResolvedArgs<T>
  ) => any;
  meta?: Partial<Meta>;
}
export interface Meta {
  helpMenu: string;
  category: string;
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
