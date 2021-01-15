import { Utilities } from '../../utilities';

import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Client } from 'anilist.js';
const AniList = new Client();
import { MangaEmbed } from '../../client/embeds';

export default class MangaCommand extends Command {
    constructor() {
        super('manga', {
            category: 'Media',
            aliases: ['manga', 'm'],
            description: { content: 'Search manga info.', usage: '[-small | -large] <title>' },
            args: [
                { id: 'size', type: ['-small', '-large'], default: '-small' },
                { id: 'manga', match: 'text' }
            ]
        });
    }

    async exec(message: Message, args: any) {
        if (!args.manga) return message.channel.send(`Correct Usage: \`manga ${this.description.usage}\``);
        args.manga = args.manga.replace('-small ', '').replace('-large ', '').replace('-massive ', '');

        const search = await AniList.searchMedia({ search: args.manga, type: 'MANGA' });
        if (!search.Results[0]) return message.channel.send(`Manga not found: \`${args.manga}\`.`);

        const m = await message.channel.send(MangaEmbed(search.Results[0].info, args.size?.replace('-', '')).setFooter(`${message.author.tag}`, message.author.avatarURL()?.toString()));
        Utilities.reactionDelete(message, m);
    }
}