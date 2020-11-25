const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const config = require('./config.json');

class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: config.ownerID,
        }, {
            disableMentions: 'everyone'
        });

        this.config = config;

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: config.prefix,
            allowMention: true,
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/events/'
        });

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    async login(token) {
        return super.login(token);
    }
}

(async () => {
    const client = new Client();

    client.on('error', console.error);
    process.on('unhandledRejection', console.error);

    client.login(config.token);
})();