import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MangaCommand extends Command {
    constructor() {
        super('manga', {
            category: 'Media',
            aliases: ['manga', 'm'],
            description: { content: 'Search Manga info.', usage: '<title>' },
            args: [
                { id: 'manga', match: 'text' }
            ]
        });
    }

    /** 
     * Search Manga.
     * @example
     * !m My Hero Academia
     */
    async exec(message: Message, args: any) {
        if (!args.manga) return message.channel.send(`Correct Usage: \`manga ${this.description.usage}\``);

        const search = await this.client.AniList.searchMedia({ search: args.manga, type: 'MANGA' });
        if (!search.Results[0]) return message.channel.send(`Manga not found: \`${args.manga}\`.`);

        const m = await message.channel.send(this.client.embeds.MangaEmbed(search.Results[0].info, message.member));
        this.client.utilities.reactionDelete(message, m);
    }
}