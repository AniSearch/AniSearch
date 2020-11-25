const { Listener } = require('discord-akairo');

module.exports = class MessageEvent extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if (message.author === this.client.user && message.embeds.length < 1 && !message.content.includes('Input:')) message.delete({ timeout: 10000 }).catch();
    }
}