import { asyncIteratorToArray } from "../util";
export const foundUserSemantics = [
  {
    names: ["self", "me", "this"],
    value: async (context: discord.GuildMemberMessage) => context.member.user,
  },
  {
    names: ["bot", "client"],
    value: async (_: discord.GuildMemberMessage) => discord.getBotUser(),
  },
];
export const foundMemberSemantics = [
  {
    names: ["self", "me", "this"],
    value: async (context: discord.GuildMemberMessage) => context.member,
  },
  {
    names: ["bot", "client"],
    value: async (_: discord.GuildMemberMessage) =>
      await (await _.getGuild()).getMember(discord.getBotId()),
  },
];
export async function findUser(
  context: discord.GuildMemberMessage,
  query?: string
): Promise<discord.User> {
  if (!query) return context.member.user;
  query = query.toLowerCase();
  if (foundUserSemantics.some((v) => v.names.includes(query)))
    return await foundUserSemantics
      .find((v) => v.names.includes(query))
      .value(context);
  const guild = await discord.getGuild();
  const members = await asyncIteratorToArray(guild.iterMembers());
  const foundMember = members.find(
    (v) =>
      v.user.id === query.replace(/\D/g, "") ||
      (v.nick && v.nick.toLowerCase() === query) ||
      v.user.username === query ||
      v.user.getTag() === query
  );
  const foundUser = foundMember
    ? foundMember.user
    : await discord.getUser(query);
  if (!foundUser) throw new Error(`Cannot find user '${query}'`);
}
export async function findMember(
  context: discord.GuildMemberMessage,
  query?: string
): Promise<discord.GuildMember> {
  if (!query) return context.member;
  query = query.toLowerCase();
  if (foundUserSemantics.some((v) => v.names.includes(query)))
    return await foundMemberSemantics
      .find((v) => v.names.includes(query))
      .value(context);
  const guild = await discord.getGuild();
  const members = await asyncIteratorToArray(guild.iterMembers());
  const foundMember = members.find(
    (v) =>
      v.user.id === query.replace(/\D/g, "") ||
      (v.nick && v.nick.toLowerCase() === query) ||
      v.user.username === query ||
      v.user.getTag() === query
  );
  if (!foundMember) throw new Error(`Cannot find member '${query}'`);
  return foundMember;
}
