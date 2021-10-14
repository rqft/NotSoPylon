import config from '../../config';
import {
  commands,
  EmbedBrands,
  EmbedColors,
  Locales,
  LocalesText
} from '../../globals';
import { createUserEmbed, splitTextByAmount, toUrlParams } from '../../util';
import { editOrReply } from '../../tools';
import { codeblock } from '../../functions/markup';
interface MyMemoryTranslationResponse {
  matches: Array<TranslationMatch>;
  responseData: {
    translatedText: string;
    match: number;
  };
  quotaFinished: boolean;
  mtLangSupported?: boolean;
  responseDetails: string;
  responseStatus: number;
  responderId: string;
  exception_code?: string;
}
interface TranslationMatch {
  id: string;
  subject: string;
  translation: string;
  source: Locales;
  target: Locales;
  match: number;
  segment: string;
  reference?: string;
  model?: string;
  quality: string;
  'last-update-date': string;
  'usage-count': number;
  'created-by': string;
  'last-updated-by': string;
  'create-date': string;
}
const Choices = [...Object.values(Locales), 'en', 'pt', 'zh', 'es'];
commands.on(
  {
    name: 'translate',
    aliases: ['tr'],
    description: 'Translate text to a different language'
  },
  (args) => ({
    from: args.string({ choices: Choices }),
    to: args.string({ choices: Choices }),
    text: args.text()
  }),
  async (message, args) => {
    const url =
      'https://api.mymemory.translated.net/get' +
      toUrlParams({
        q: args.text.slice(0, 500),
        langpair: `${args.from}|${args.to}`
      });
    const request = await fetch(url);
    const data: MyMemoryTranslationResponse = await request.json();

    const { matches } = data;
    const match = matches.sort((x, y) => +y.quality - +x.quality)[0];
    console.log(match);

    const embed = createUserEmbed(message.member.user);
    embed.setColor(EmbedColors.DEFAULT);
    embed.setFooter({
      text: 'Google Translate',
      iconUrl: EmbedBrands.GOOGLE_GO
    });
    let [fromLanguage, translatedLanguage] = [match.source, match.target];
    let fromLanguageText: string = match.source;
    if (fromLanguage in LocalesText) {
      fromLanguageText = LocalesText[fromLanguage];
    }
    let translatedLanguageText: string = translatedLanguage;
    if (translatedLanguage in LocalesText) {
      translatedLanguageText = LocalesText[translatedLanguage];
    }
    embed.setTitle(
      `Translated from ${fromLanguageText} to ${translatedLanguageText}`
    );

    const shouldShowInput = match.translation !== args.text;
    if (shouldShowInput) {
      const parts = splitTextByAmount(args.text, 1014, '');
      embed.addField({
        name: fromLanguageText,
        value: codeblock(parts.shift() as string)
      });
      for (let part of parts) {
        embed.addField({ name: '\u200b', value: codeblock(part) });
      }
    }
    {
      // 1024 - 10 ('```\n\n```')
      const parts = splitTextByAmount(match.translation, 1014, '');
      const title =
        fromLanguage === translatedLanguage || shouldShowInput
          ? translatedLanguageText
          : `${fromLanguageText} -> ${translatedLanguageText}`;
      embed.addField({
        name: title,
        value: codeblock(parts.shift() as string)
      });
      for (let part of parts) {
        embed.addField({ name: '\u200b', value: codeblock(part) });
      }
    }
    await editOrReply(message, embed);
  }
);
