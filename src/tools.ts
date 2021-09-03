export function toTitleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join(" ");
}

const replies = new Map<string, discord.Message>();
export async function editOrReply(
  ctx: discord.Message,
  options: discord.Message.OutgoingMessageOptions
) {
  if (typeof options === "string") {
    options = { content: options };
  }
  let reply: discord.Message;
  if (replies.has(ctx.id)) {
    options = Object.assign(
      { attachments: [], content: "", embed: null },
      options
    );

    const old = replies.get(ctx.id)!;
    if (old.attachments.length || options.attachments.length) {
      old.delete();
      reply = await old.reply(options);
    }
    reply = await old.edit(options);
  }
  replies.set(ctx.id, reply);
  return reply;
}
export function defaultAvatarUrl(user: discord.User) {
  return `https://cdn.discord.com/embed/avatars/${+user.discriminator % 5}.png`;
}
