import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import humanize from 'humanize-duration';

export default class InfoCommand extends Command {
    constructor() {
		super('info', {
			category: 'Misc',
			aliases: ['info'],
	   		description: { content: 'Bot information.' },
		});
    }
    
    async exec(message: Message) {
		message.channel.send(new MessageEmbed({
            color: '#0099ff',
            footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()?.toString()},
            timestamp: new Date(),

            fields: [
                { name: 'Stats', value: `Servers: ${this.client.guilds.cache.size}\nUsers: ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\nUptime: ${humanize(Number(this.client.uptime))}` },
                { name: 'Links', value: '[GitHub Repository](https://github.com/MrScopes/AniSearch/)\n[anilist.js](https://npmjs.com/package/anilist.js/) (API wrapper for AniList)' }
            ]
            
        }));
    }
}