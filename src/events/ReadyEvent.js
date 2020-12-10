const { Listener } = require('discord-akairo');

module.exports = class ReadyEvent extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log(`Logged in as ${this.client.user.tag}!`);
        this.client.user.setActivity('a!help', { type: 'PLAYING' });
    }
}