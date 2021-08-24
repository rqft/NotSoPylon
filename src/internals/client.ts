export class NotSoClient {
  private _commandGroup: discord.command.CommandGroup;
  constructor(commands: NotSoCommand[]) {
    this._commandGroup = new discord.command.CommandGroup();
    commands.forEach((v) => {});
  }
}
export interface NotSoCommand {}
