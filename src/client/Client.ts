import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Client as AniList } from 'anilist.js';
import { Pool } from 'pg';

import config from '../config.json';
import { Utilities } from './Utilities';
import { Embeds } from './Embeds';

export class Client extends AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;

    constructor() {
        super({ ownerID: config.ownerID }, { disableMentions: 'everyone' });

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: async (message) => { 
                if (!message.guild) return config.defaultConfig.prefix;

                const client = await this.pool.connect();

                const guild = await client.query('SELECT * FROM guilds WHERE id = $1', [ message.guild?.id ]);
                if (!guild.rows[0]) {
                    await client.query('INSERT INTO guilds (id, prefix) VALUES ($1, $2)', [ message.guild?.id, config.defaultConfig.prefix ])
                    return config.defaultConfig.prefix;
                }

                client.release();

                return guild.rows[0].prefix || config.defaultConfig.prefix;
            },
            allowMention: true,
        });

        this.listenerHandler = new ListenerHandler(this, { directory: './src/events/' });

        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        this.config = config;
        this.utilities = new Utilities(this);
        this.AniList = new AniList();
        this.embeds = new Embeds(this);
        this.pool = new Pool({ 
            host: config.postgres.host, 
            port: config.postgres.port || 5432,
            database: config.postgres.database, 
            user: config.postgres.user,
            password: config.postgres.password
        });
    }

    login(token: string) {
        return super.login(token);
    }
}

declare module 'discord-akairo' {
    interface AkairoClient {
        /** The client's config. */
        config: typeof config;
        /** The client's utilities. */
        utilities: Utilities;
        /** The client's anilist.js client. */
        AniList: AniList;
        /** The client's embeds. */
        embeds: Embeds;
        /** The client's postgres connection. */
        pool: Pool;
    }
}