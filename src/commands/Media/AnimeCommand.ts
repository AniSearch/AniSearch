import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class AnimeCommand extends Command {
    constructor() {
        super('anime', {
            category: 'Media',
            aliases: ['anime', 'a'],
            description: { content: 'Search Anime info.', usage: '[-small | -large | -massive] [-popularity | -score | -favourites] <title>' },
            args: [
                { id: 'options', type: ['-small', '-large', '-massive'], default: '-small' },
                { id: 'sort', type: ['-popularity', '-score', '-favourites'], default: '-search_match' },
                { id: 'anime', match: 'text' }
            ]
        });
    }

    async exec(message: Message, args: any) {
        if (!args.anime) return message.channel.send(`Correct Usage: \`anime ${this.description.usage}\``);
        args.anime = args.anime
            .replace('-small ', '')
            .replace('-large ', '')
            .replace('-massive ', '')
            .replace('-popularity ', '')
            .replace('-score ', '')
            .replace('-favourites ', '');

        args.size = args.size?.replace('-', '');

        args.sort = args.sort.replace('-', '').toUpperCase();
        if (args.sort !== 'SEARCH_MATCH') args.sort = args.sort.replace('-', '').toUpperCase() + '_DESC';

        const search = await this.client.AniList.searchMedia({ search: args.anime, type: 'ANIME', sort: args.sort.toUpperCase() });
        if (!search.Results[0]) return message.channel.send(`Anime not found: \`${args.anime}\`.`);

        const m = await message.channel.send(this.client.embeds.AnimeEmbed(search.Results[0].info, args.size)
            .setFooter(`${message.author.tag} | anime`, message.author.avatarURL()?.toString()));
        this.client.utilities.reactionDelete(message, m);
    }
}