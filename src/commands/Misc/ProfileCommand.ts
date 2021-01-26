// CREATE TABLE users (id text, anilist text, mal text)

import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

export default class ProfileCommand extends Command {
    constructor() {
		super('profile', {
			category: 'Misc',
			aliases: ['profile', 'anilist', 'mal'],
            description: { content: 'View a user\'s AniList and MAL accounts.' },
            args: [{ id: 'user', type: 'member' }]
		});
    }
	
    /** 
     * Get a user's stored AniList and MAL links.
     * @example
     * !profile
     * !profile @MrScopes#5548
     * !profile 496477678103298052
    */
    async exec(message: Message, args: any) {
        const target: GuildMember = args.user || message.member;
        
        const json = await this.client.pool.query('SELECT * FROM users WHERE id = $1', [ target.id ]);
        if (!json.rows[0]) return message.react('❌');

        const m = await message.channel.send(this.client.embeds.ProfileEmbed(json.rows[0], target));
        this.client.utilities.reactionDelete(message, m);
    }
}