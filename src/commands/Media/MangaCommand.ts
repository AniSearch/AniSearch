import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

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

        const search = await this.client.AniList.searchMedia({ search: args.manga, type: 'MANGA' });
        if (!search.Results[0]) return message.channel.send(`Manga not found: \`${args.manga}\`.`);

        const m = await message.channel.send(this.client.embeds.MangaEmbed(search.Results[0].info, args.size?.replace('-', ''))
            .setFooter(`${message.author.tag}`, message.author.avatarURL()?.toString()));
        this.client.utilities.reactionDelete(message, m);
    }
}