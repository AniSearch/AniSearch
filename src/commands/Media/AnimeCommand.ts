import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class AnimeCommand extends Command {
    constructor() {
        super('anime', {
            category: 'Media',
            aliases: ['anime', 'a'],
            description: { content: 'Search Anime info.', usage: '<title>' },
            args: [
                { id: 'anime', match: 'text' }
            ]
        });
    }

    /** 
     * Search an Anime.
     * @example
     * !a My Hero Academia
     */
    async exec(message: Message, args: any) {
        if (!args.anime) return message.channel.send(`Correct Usage: \`anime ${this.description.usage}\``);

        const search = await this.client.AniList.searchMedia({ search: args.anime, type: 'ANIME' });
        if (!search.Results[0]) return message.channel.send(`Anime not found: \`${args.anime}\`.`);

        const m = await message.channel.send(this.client.embeds.AnimeEmbed(search.Results[0].info, message.member));
        this.client.utilities.reactionDelete(message, m, 5000);
    }
}