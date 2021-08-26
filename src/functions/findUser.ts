import { asyncIteratorToArray } from "../util";
export const foundUserSemantics = [
  {
    names: ["self", "me", "this"],
    value: (context: discord.GuildMemberMessage) => context.member.user,
  },
];
export async function findUser(
  context: discord.GuildMemberMessage,
  query?: string
) {
  if (!query) return context.member.user;
  if (foundUserSemantics.some((v) => v.names.includes(query.toLowerCase())))
    return foundUserSemantics
      .find((v) => v.names.includes(query.toLowerCase()))
      .value(context);
  const guild = await discord.getGuild();
  const members = await asyncIteratorToArray(guild.iterMembers());
}
