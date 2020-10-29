import * as utils from '../lib/utils';
import {isModuleEnabled} from '../lib/eventHandler/routing'
import { config, guildId, globalConfig, InitializeConfig } from '../config';

enum FormatMode {
    'PLAIN' = 'PLAIN',
    'PRETTY' = 'PRETTY'
}
class Subreddit {
    name: string;
    channelId: string;
    channel: discord.GuildTextChannel | discord.GuildNewsChannel | undefined = undefined;
    mode: FormatMode;
    stats: boolean;
    role: string | undefined;
    constructor(name: string, channel: string, mode: FormatMode, stats: boolean, role: string | undefined) {
        this.name = name;
        this.channelId = channel;
        this.mode = mode;
        this.stats = stats;
        this.role = role;
        return this;
    }
}

const kv = new pylon.KVNamespace('reddit');


export async function updateSubs(): Promise<void> {
    if(!isModuleEnabled('reddit')) return;
    const modConfig = config.modules.reddit;
    if(!modConfig || !modConfig.subs || !Array.isArray(modConfig.subs)) return;
    let subs: Array<Subreddit> = modConfig.subs.map((val: any) => {
        if(!val.channel || !val.mode || !val.stats || !val.name) return;
        return new Subreddit(val.name, val.channel, val.mode, val.stats, val.role);
    });
    subs = await Promise.all(subs.map(async (sub) => {
        const channel = await discord.getChannel(sub.channelId);
        if(!channel) return;
        if(channel.type !== discord.Channel.Type.GUILD_TEXT && channel.type !== discord.Channel.Type.GUILD_NEWS) return;
        sub.channel = channel;
        return sub;
    }));
    if(subs.length > 3) return;
    const times = await kv.get('lastUpdated') || {};
    let timesNew = JSON.parse(JSON.stringify(times));
    await Promise.all(subs.map(async (sub) => {
        const req = await fetch(`https://www.reddit.com/r/${sub.name}/new.json`);
        if(req.status !== 200) return;
        const json: any = await req.json();
        if(!json.data || !json.data.children) return;
        const data: Array<any> = json.data.children;
        const posts = data.map((v) => v.data).reverse();
        let postedCount = 0;
        for(var i = 0; i < posts.length; i++) {
            if(postedCount >= 3) break;
            const post = posts[i];
            const utc = new Date(+(post['created_utc'])*1000).getTime();
            if(times[sub.name] && utc <= times[sub.name]) continue;
            timesNew[sub.name] = utc;
            console.log('posting', sub.name);
            const res = await sendPost(sub.channel, sub, post);
            postedCount++;
        }

    }))
    if(times !== timesNew) await kv.put('lastUpdated', timesNew);
}

async function sendPost(channel: discord.GuildTextChannel | discord.GuildNewsChannel, config: Subreddit, data: any): Promise<boolean> {
    const guild = await discord.getGuild();
    const me = await guild.getMember(discord.getBotId());
    if(!channel.canMember(me, discord.Permissions.SEND_MESSAGES) || !channel.canMember(me, discord.Permissions.EMBED_LINKS)) return false;
    if(typeof data['nsfw'] !== 'undefined' && data['nsfw']) {
        if(!channel.nsfw) return;
    }
    let title: string = data.title;
    if(title.length > 256) {
        title = title.substr(0, 252) + ' ...';
    }
    if(config.mode === 'PLAIN') {
        await channel.sendMessage({content: `${config.role ? `<@&${config.role}>`: ''}**${title}**\nhttps://reddit.com${data.permalink}`, allowedMentions: {roles: config.role ? [config.role] : undefined}})
    } else {
        const embed = new discord.Embed();
        if(typeof data['nsfw'] !== 'undefined' && data['nsfw']) {
            embed.setColor(0xff6961);
        } else {
            embed.setColor(0xaecfc8);
        }
        embed.setUrl('https://reddit.com' + data.permalink);
        embed.setAuthor({})
        await channel.sendMessage({content: `${config.role ? `<@&${config.role}>`: ''}`, embed, allowedMentions: {roles: config.role ? [config.role] : undefined}})
    }
    return true;
}