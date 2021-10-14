import { toUrlParams } from './util';

export interface ImaggaResult<T> {
  result: T;
  status: {
    text: string;
    type: 'success' | 'error';
  };
}

export interface Body {
  image_url?: string;
  [x: string]: any;
}
export type Language<T> = { en: T };
export type NumberBoolean = 0 | 1;

export interface TagsResult {
  tags: Array<Tag>;
}
export interface Tag {
  confidence: number;
  tag: Language<string>;
}

export interface CategorizersResult {
  categorizers: Array<Categorizer>;
}
export interface Categorizer {
  id: string;
  labels: Array<string>;
  title: string;
}

export interface CategoriesResult {
  categories: Array<Category>;
}
export interface Category {
  confidence: number;
  name: Language<string>;
}

export interface CroppingsResult {
  croppings: Array<Cropping>;
}
export interface Cropping {
  target_height: number;
  target_width: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface ColorsResult {
  colors: Colors;
}
export interface Colors {
  background_colors: Array<Color & { percentage: string }>;
  color_variance: number;
  object_percentage: number;
  image_colors: Array<Color & { percent: string }>;
  color_percent_threshold: number;
  foreground_colors: Array<Color & { percentage: string }>;
}
export interface Color {
  r: number;
  g: number;
  b: number;
  closest_palette_color: string;
  closest_palette_distance: number;
  closest_palette_color_html_code: string;
  html_code: string;
  closest_palette_color_parent: string;
}

export interface UsageResult {
  billing_period_end: string;
  billing_period_start: string;
  concurrency?: {
    max: number;
    now: number;
  };
  daily: Record<string, number>;
  daily_for: string;
  daily_processed: number;
  daily_requests: number;
  last_usage: number;
  monthly: Record<string, number>;
  monthly_limit: number;
  monthly_processed: number;
  monthly_requests: number;
  total_processed: number;
  total_requests: number;
  weekly: Record<string, number>;
  weekly_processed: number;
  weekly_requests: number;
}
export interface TextResult {
  text: Record<number, Text>;
}
export interface Coordinates {
  width: number;
  height: number;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}
export interface Text {
  data: string;
  coordinates: Coordinates;
}

export class Imagga {
  private headers: { Authorization: string };
  public token: string;
  private baseUrl: string = 'https://api.imagga.com/v2/';
  constructor(token: string) {
    this.token = token;
    this.headers = { Authorization: this.token };
  }
  public async tags(
    imageUrl: string,
    other?: Partial<{
      language: string;
      verbose: NumberBoolean;
      threshold: number;
      decrease_parents: NumberBoolean;
    }>,
    taggerId: string = ''
  ) {
    return await this.get<TagsResult>(`tags/${taggerId}`, {
      image_url: imageUrl,
      ...other
    });
  }
  public async categorizers() {
    return await this.get<CategorizersResult>('categorizers');
  }
  public async categories(
    imageUrl: string,
    categorizerId: string,
    others?: Partial<{ language: string }>
  ) {
    return await this.get<CategoriesResult>(`categories/${categorizerId}`, {
      image_url: imageUrl,
      ...others
    });
  }
  public async croppings(
    imageUrl: string,
    resolution?: Array<string>,
    others?: Partial<{
      no_scaling: NumberBoolean;
      rect_percentage: number;
      image_result: NumberBoolean;
    }>
  ) {
    return await this.get<CroppingsResult>('croppings', {
      image_url: imageUrl,
      resolution: (resolution ?? []).join(','),
      ...others
    });
  }
  public async colors(
    imageUrl: string,
    others?: Partial<{
      extract_overall_colors: NumberBoolean;
      extract_object_colors: NumberBoolean;
      overall_count: number;
      separated_count: number;
      deterministic: NumberBoolean;
      features_type: 'overall' | 'object';
    }>
  ) {
    return this.get<ColorsResult>('colors', { image_url: imageUrl, ...others });
  }
  public async usage(
    history: NumberBoolean = 0,
    concurrency: NumberBoolean = 0
  ) {
    return this.get<UsageResult>('usage', { history, concurrency });
  }
  public async text(imageUrl: string) {
    return this.get<TextResult>('text', { image_url: imageUrl });
  }

  private async get<T>(endpoint: string, body: Body = {}) {
    const request = await fetch(
      `${this.baseUrl}${endpoint}${toUrlParams(body)}`,
      { headers: this.headers }
    );
    if (!request.ok)
      throw new Error(
        `Error whilst fetching '${request.url}' (${request.status}): ${request.statusText}`
      );

    const data = (await request.json()) as ImaggaResult<T>;
    if (data.status.type !== 'success') throw new Error(data.status.text);

    return data.result;
  }
}

export interface Options {
  endpoint: string;
  images?: Array<string>;
}
export type EyesType =
  | 'big'
  | 'black'
  | 'bloodshot'
  | 'blue'
  | 'default'
  | 'googly'
  | 'green'
  | 'horror'
  | 'illuminati'
  | 'money'
  | 'pink'
  | 'red'
  | 'small'
  | 'spinner'
  | 'spongebob'
  | 'white'
  | 'yellow'
  | 'random';
export type FlagType =
  | 'asexual'
  | 'aromantic'
  | 'bisexual'
  | 'pansexual'
  | 'gay'
  | 'lesbian'
  | 'trans'
  | 'nonbinary'
  | 'genderfluid'
  | 'genderqueer'
  | 'polysexual'
  | 'austria'
  | 'belgium'
  | 'botswana'
  | 'bulgaria'
  | 'ivory'
  | 'estonia'
  | 'france'
  | 'gabon'
  | 'gambia'
  | 'germany'
  | 'guinea'
  | 'hungary'
  | 'indonesia'
  | 'ireland'
  | 'italy'
  | 'luxembourg'
  | 'monaco'
  | 'nigeria'
  | 'poland'
  | 'russia'
  | 'romania'
  | 'sierralione'
  | 'thailand'
  | 'ukraine'
  | 'yemen';
export type SnapChatFilter =
  | 'dog'
  | 'dog2'
  | 'dog3'
  | 'pig'
  | 'flowers'
  | 'clown'
  | 'random';
export type SafeSearchTypes = 'off' | 'moderate' | 'strict';
export type Timespan =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1mo';
export interface WebSearchResult {
  results: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  news: Array<{
    title: string;
    source: string;
    image?: string;
    url: string;
  }>;
  images: Array<string>;
  relatedQueries: Array<string>;
}

export class PxlAPI {
  public readonly token: string;
  public headers: HeadersInit;
  public readonly baseUrl = 'https://api.pxlapi.dev/';
  constructor(accessToken: string) {
    this.token = accessToken;
    this.headers = {
      Authorization: `Application ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
  public async ajit(images: Array<string>) {
    return await this.post({ endpoint: 'ajit', images });
  }
  public async emojiMosaic(
    images: Array<string>,
    body: { groupSize?: number; scale?: boolean }
  ) {
    return await this.post({ endpoint: 'emojimosaic', images }, body);
  }
  public async eyes(
    images: Array<string>,
    type: EyesType = 'default',
    allowedRandomFilters?: Array<EyesType>
  ) {
    return await this.post(
      { endpoint: `eyes/${type}`, images },
      { type: allowedRandomFilters }
    );
  }
  public async flag(
    images: Array<string>,
    flag: FlagType = 'gay',
    body?: { opacity?: number }
  ) {
    return await this.post({ endpoint: `flag/${flag}`, images }, body);
  }
  public async flash(images: Array<string>) {
    return await this.post({ endpoint: 'flash', images });
  }
  public async ganimal(images: Array<string>) {
    return await this.post({ endpoint: 'ganimal', images });
  }
  public async glitch(
    images: Array<string>,
    body: {
      iterations?: number;
      amount?: number;
      gif?: { count?: number; delay?: number };
    }
  ) {
    return await this.post({ endpoint: 'glitch', images }, body);
  }
  public async imagescript(
    code: string,
    version: string = 'latest',
    body: { inject?: object; timeout?: number }
  ) {
    return await this.post(
      { endpoint: `imagescript/${version}` },
      { ...body, code }
    );
  }
  public async imagescriptVersions() {
    return await this.get(`imagescript/versions`, 'json');
  }
  public async jpeg(images: Array<string>, quality: number = 1) {
    return await this.post({ endpoint: 'jpeg', images }, { quality });
  }
  public async lego(
    images: Array<string>,
    body: { groupSize?: number; scale?: boolean }
  ) {
    return await this.post({ endpoint: 'lego', images }, body);
  }
  public async snapchat(
    images: Array<string>,
    filter: SnapChatFilter = 'dog',
    allowedRandomFilters?: Array<SnapChatFilter>
  ) {
    return await this.post(
      { endpoint: `snapchat/${filter}`, images },
      { type: allowedRandomFilters }
    );
  }
  public async sonic(text: string) {
    return await this.post({ endpoint: 'sonic' }, { text });
  }
  public async thonkify(text: string) {
    return await this.post({ endpoint: 'thonkify' }, { text });
  }

  public async imageSearch(
    query: string,
    safeSearch: SafeSearchTypes,
    meta: false
  ): Promise<Array<string>>;
  public async imageSearch(
    query: string,
    safeSearch: SafeSearchTypes,
    meta: true
  ): Promise<Array<{ url: string; title: string; location: string }>>;
  public async imageSearch(
    query: string,
    safeSearch: SafeSearchTypes = 'strict',
    meta: boolean = false
  ) {
    return await this.post(
      { endpoint: 'image_search' },
      { query, safeSearch, meta },
      'json'
    );
  }

  public async kLines(pair: string, timespan: Timespan = '1m', limit?: number) {
    return await this.post({ endpoint: `klines/${pair}` }, { timespan, limit });
  }

  public async screenshot(
    url: string,
    body?: {
      device?: string;
      locale?: string;
      blocklist?: Array<string>;
      defaultBlocklist?: boolean;
      browser?: 'chromium' | 'firefox';
      theme?: 'light' | 'dark';
      timeout?: number;
      fullPage?: boolean;
    }
  ) {
    return await (
      await fetch(`https://api.pxlapi.dev/screenshot/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Application ${this.token}`
        },
        method: 'POST',
        body: JSON.stringify({ url })
      })
    ).arrayBuffer();
  }

  public async webSearch(
    query: string,
    safeSearch: SafeSearchTypes = 'strict'
  ): Promise<Array<WebSearchResult>> {
    return await this.post(
      { endpoint: 'web_search' },
      { query, safeSearch },
      'json'
    );
  }

  // lol
  private async get(endpoint: string, as: 'arrayBuffer'): Promise<ArrayBuffer>;
  private async get(endpoint: string, as: 'json'): Promise<any>;
  private async get(endpoint: string, as: 'text'): Promise<string>;
  private async get(
    endpoint: string,
    as: 'text' | 'json' | 'arrayBuffer' = 'arrayBuffer'
  ) {
    const request = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers,
      method: 'GET'
    });
    if (!request.ok || request.status !== 200)
      throw new Error(
        `Error ${request.status} whilst fetching '${request.url}': ${request.statusText}`
      );
    return await request[as]();
  }

  private async post(
    opt: Options,
    body?: object,
    as?: 'arrayBuffer'
  ): Promise<ArrayBuffer>;
  private async post(opt: Options, body?: object, as?: 'json'): Promise<any>;
  private async post(opt: Options, body?: object, as?: 'text'): Promise<string>;
  private async post(
    opt: Options,
    body?: object,
    as: 'text' | 'json' | 'arrayBuffer' = 'arrayBuffer'
  ) {
    const request = await fetch(`${this.baseUrl}${opt.endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ body, images: opt.images })
    });
    console.log(await request.text());
    return await request[as]();
  }
}
export const SRA_IMAGE_URL = 'https://some-random-api.ml/img/';
export const SRA_FACT_URL = 'https://some-random-api.ml/facts/';
export enum SraAnimals {
  FOX = 'fox',
  DOG = 'dog',
  PANDA = 'panda',
  RED_PANDA = 'red_panda',
  KOALA = 'koala',
  BIRD = 'birb',
  CAT = 'cat'
}
export const SraAnimalsText = {
  [SraAnimals.FOX]: 'Fox',
  [SraAnimals.DOG]: 'Dog',
  [SraAnimals.PANDA]: 'Panda',
  [SraAnimals.RED_PANDA]: 'Red Panda',
  [SraAnimals.KOALA]: 'Koala',
  [SraAnimals.BIRD]: 'Bird',
  [SraAnimals.CAT]: 'Cat'
};
export const SraAnimalsEmojis = {
  [SraAnimals.FOX]: discord.decor.Emojis.FOX,
  [SraAnimals.DOG]: discord.decor.Emojis.DOG,
  [SraAnimals.PANDA]: discord.decor.Emojis.PANDA_FACE,
  [SraAnimals.RED_PANDA]: discord.decor.Emojis.PANDA_FACE,
  [SraAnimals.KOALA]: discord.decor.Emojis.KOALA,
  [SraAnimals.BIRD]: discord.decor.Emojis.BIRD,
  [SraAnimals.CAT]: discord.decor.Emojis.CAT
};
