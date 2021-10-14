import { TAG_KV } from '../config';
export enum TagMethods {
  SHOW = 'show',
  EDIT = 'edit',
  CREATE = 'create',
  DELETE = 'delete',
  LIST = 'list'
}
export const TagEmbedThumbnails = {
  [TagMethods.CREATE]:
    'https://cdn.discordapp.com/emojis/801248680476016671.png?v=1',
  [TagMethods.DELETE]:
    'https://cdn.discordapp.com/emojis/890068525408981002.png?v=1',
  [TagMethods.EDIT]:
    'https://cdn.discordapp.com/emojis/836702490413629490.png?v=1',
  [TagMethods.LIST]:
    'https://cdn.discordapp.com/emojis/798624241351655514.png?v=1',
  [TagMethods.SHOW]:
    'https://cdn.discordapp.com/emojis/798624234745757727.png?v=1'
};
export interface TagOut extends pylon.JsonObject {
  userId: string;
  content: string;
}
export interface Tag extends TagOut {
  name: string;
}
export async function putTag(tag: Tag) {
  TAG_KV.put(tag.name, { userId: tag.userId, content: tag.content });
  return tag;
}
export async function getTag(name: string): Promise<Tag> {
  const value = await TAG_KV.get<TagOut>(name);
  if (!value) throw new Error('Tag not found');
  return { name, ...value };
}
export async function hasTag(name: string): Promise<boolean> {
  return !!(await TAG_KV.get<TagOut>(name));
}
export async function listTags(userId?: discord.Snowflake) {
  const allTags = await Promise.all((await listTagKeys()).map(getTag));
  if (userId) return allTags.filter((v) => v.userId === userId);
  return allTags;
}
export async function listTagKeys() {
  return await TAG_KV.list();
}
export async function tagCount() {
  return await TAG_KV.count();
}
export async function randomTag(): Promise<Tag> {
  const tags = await listTagKeys();
  return await getTag(tags[~~(Math.random() * tags.length)]);
}
export async function deleteTag(name: string) {
  if (!(await hasTag(name))) throw new Error('Tag not found');
  const tag = await getTag(name);
  TAG_KV.delete(tag.name);
  return tag;
}
export async function clearTags() {
  const tags = await listTags();
  TAG_KV.clear();
  return tags;
}
