import { isSnowflake } from "./util";
import { regex as discordRegex, DiscordRegexNames } from "./globals";
export module Parameters {
  export async function role(
    value: string,
    context: discord.GuildMemberMessage
  ): Promise<discord.Role | null> {
    if (value) {
      const guild = await context.getGuild();
      const roles = await guild.getRoles();
      if (guild) {
        {
          const { matches } = discordRegex(
            DiscordRegexNames.MENTION_ROLE,
            value
          ) as { matches: Array<{ id: string }> };
          if (matches.length) {
            const { id: roleId } = matches[0];
            const role = roles.find((v) => v.id === roleId);
            if (role) {
              return role;
            }
          }
        }
        if (isSnowflake(value)) {
          const role = roles.find((v) => v.id === value);
          if (role) {
            return role;
          }
        }
        value = value.toLowerCase();
        for (let role of roles) {
          if (role.name.toLowerCase().startsWith(value)) {
            return role;
          }
        }
        for (let role of roles) {
          if (role.name.toLowerCase().includes(value)) {
            return role;
          }
        }
      }
    }
    return null;
  }
}
