export interface Reminder extends pylon.JsonObject {
  id: number;
  content: string;
  expires: number;
  from: ReminderFrom;
}
export interface ReminderFrom extends pylon.JsonObject {
  userId: string;
  channelId: string;
  messageId: string;
}

export class Reminders {
  public namespace: pylon.KVNamespace;
  constructor(namespace: string = "reminders") {
    this.namespace = new pylon.KVNamespace(namespace);
  }

  public async getReminder(id: number): Promise<Reminder> {
    return this.namespace.get<Reminder>(id.toString());
  }

  public async getReminders(): Promise<Reminder[]> {
    return (await this.namespace.items()).map(({ value }) => value as Reminder);
  }

  public async putReminder(reminder: Reminder): Promise<this> {
    this.namespace.put(reminder.id.toString(), reminder);
    return this;
  }

  public async deleteReminder(id: number): Promise<this> {
    this.namespace.delete(id.toString());
    return this;
  }

  public async addReminder(
    content: string,
    expires: number,
    from: ReminderFrom
  ): Promise<this> {
    this.putReminder(await Reminders.createReminder(content, expires, from));
    return this;
  }

  public async getPassedReminders(): Promise<Array<Reminder>> {
    return (await this.getReminders()).filter((v) => Date.now() > v.expires);
  }

  static async createReminder(
    content: string,
    expires: number,
    from: ReminderFrom
  ): Promise<Reminder> {
    return {
      id: await this.nextReminderId(),
      content,
      expires,
      from,
    };
  }
  static async nextReminderId(namespace: string = "reminders") {
    const reminders = await new this(namespace).getReminders();
    return reminders.length + 1;
  }
}

export const remindersGroup = discord.interactions.commands.registerGroup({
  name: "remind",
  description: "Reminders",
});
remindersGroup.register(
  {
    name: "add",
    description: "Add a reminder",
    options: (args) => ({
      content: args.string("content"),
      expires: args.string("expires"),
    }),
  },
  async (interaction, args) => {}
);
