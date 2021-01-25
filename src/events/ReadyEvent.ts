import { Listener } from 'discord-akairo';

export default class ReadyEvent extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	/** Called when the bot is ready. */
	exec() {
		console.log(`Logged in as ${this.client.user?.tag}!`);
		this.client.user?.setActivity('Anime', { type: 'WATCHING' });
	}
}