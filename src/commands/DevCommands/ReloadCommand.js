const { Command } = require('discord-akairo');

module.exports = class ReloadCommand extends Command {
	constructor() {
		super('reload', {
            aliases: ['reload', 'rl'],
            category: 'Dev',
            description: { content: 'Reloads all commands and events. (owner only)' },
            ownerOnly: true
        });
	}
	
	async exec(message) {
        try {
            this.client.commandHandler.reloadAll();
            this.client.listenerHandler.reloadAll();
            message.channel.send('Sucessfully reloaded.');
        } catch(e) { message.channel.send('Error Reloading: ' + e) };
    };
}