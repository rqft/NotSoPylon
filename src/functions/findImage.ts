import { EmbeddableRegexes, MessageEmbedTypes, TRUSTED_URLS } from '../globals';
import { getFileExtension } from '../util';

export function findImageUrlInMessages(
  messages: Array<discord.GuildMemberMessage>
): null | string {
  for (const message of messages.values()) {
    const url = findImageUrlInMessage(message);
    if (url) {
      return url;
    }
  }
  return null;
}
export function findImageUrlInMessage(
  message: discord.GuildMemberMessage,
  url?: string
): null | string {
  if (url) {
    for (let embed of message.embeds) {
      if (embed.url === url) {
        return findImageUrlInEmbed(embed);
      }
    }
  }
  for (let attachment of message.attachments) {
    const url = findImageUrlInAttachment(attachment);
    if (url) {
      return url;
    }
  }
  for (let embed of message.embeds) {
    const url = findImageUrlInEmbed(embed);
    if (url) {
      return url;
    }
  }
  //   for (let sticker of message.stickerItems) {
  //     return sticker.assetUrl;
  //   }
  return null;
}
export function findImageUrlInEmbed(
  embed: discord.Embed,
  ignoreGIFV: boolean = false
): null | string {
  if (!ignoreGIFV && embed.type === MessageEmbedTypes.GIFV) {
    // try to use our own unfurler for the url since it'll use the thumbnail
    // imgur returns the .gif image in thumbnail, so check if that ends with .gif
    const url = findImageUrlInEmbed(embed, true);
    if (url && url.endsWith('.gif')) {
      return url;
    }
    if (embed.url) {
      return embed.url;
    }
    return null;
  }
  const { image } = embed;
  if (image && image.proxyUrl && (image.height || image.width)) {
    if (image.url) {
      const url = new URL(image.url);
      if (TRUSTED_URLS.includes(url.host)) {
        return image.url;
      }
    }
    return image.proxyUrl;
  }
  const { thumbnail } = embed;
  if (
    thumbnail &&
    thumbnail.proxyUrl &&
    (thumbnail.height || thumbnail.width)
  ) {
    if (thumbnail.url) {
      const url = new URL(thumbnail.url);
      if (TRUSTED_URLS.includes(url.host)) {
        return thumbnail.url;
      }
    }
    return thumbnail.proxyUrl;
  }
  const { video } = embed;
  if (video && video.url && (video.height || video.width)) {
    return video.url + '?format=png';
  }
  return null;
}
export function findImageUrlInAttachment(
  attachment: discord.Message.IMessageAttachment
): null | string {
  if (attachment.proxyUrl && (attachment.height || attachment.width)) {
    if (!!EmbeddableRegexes.image.exec(getFileExtension(attachment))) {
      if (attachment.url) {
        const url = new URL(attachment.url);
        if (TRUSTED_URLS.includes(url.host)) {
          return attachment.url;
        }
      }
      return attachment.proxyUrl;
    } else if (!!EmbeddableRegexes.video.exec(getFileExtension(attachment))) {
      return attachment.proxyUrl + '?format=png';
    }
  }
  return null;
}
