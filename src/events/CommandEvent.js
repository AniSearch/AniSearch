const { Listener } = require('discord-akairo');

module.exports = class CommandEvent extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });
    }

    exec(message, command, args, returnValue) {
        message.delete({ timeout: 5000 }).catch();
    }
}