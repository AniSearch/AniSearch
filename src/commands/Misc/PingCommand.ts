import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
    constructor() {
		super('ping', {
			category: 'Misc',
			aliases: ['ping'],
	   		description: { content: 'View the bot latency to discord.' },
		});
    }
	
	/** Ping discord. */
    async exec(message: Message) {
		const ping = await message.channel.send('Ping?');
		ping.edit(`:clock1030: Pong! ${ping.createdTimestamp - message.createdTimestamp}ms response\n${this.client.ws.ping}ms API Heartbeat :heart:`);

		this.client.utilities.reactionDelete(message, ping);
    }
}