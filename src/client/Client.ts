import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';

import config from '../config.json';
import { pool } from './postgres/pool';

class Client extends AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;

    constructor() {
        super({ ownerID: config.ownerID }, { disableMentions: 'everyone' });

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: async (message) => { 
                if (!message.guild) return config.prefix;

                const client = await pool.connect();

                const guild = await client.query('SELECT * FROM guilds WHERE id = $1', [ message.guild?.id ]);
                if (!guild.rows[0]) {
                    await client.query('INSERT INTO guilds (id, prefix) VALUES ($1, $2)', [ message.guild?.id, config.prefix ])
                    return config.prefix;
                }

                client.release();

                return guild.rows[0].prefix || config.prefix;
            },
            allowMention: true,
        });

        this.listenerHandler = new ListenerHandler(this, { directory: './src/events/' });

        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

    }

    login(token: string) {
        return super.login(token);
    }
}

export { Client };