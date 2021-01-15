import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { pool } from '../../client/postgres/pool';
import config from '../../config.json';

export default class ConfigCommand extends Command {
    constructor() {
		super('config', {
            category: 'Misc',
            userPermissions: ['MANAGE_GUILD'],            
			aliases: ['config'],
            description: { content: 'Configure the server\'s AniSearch settings. Requires \'MANAGE_GUILD\' permissions.', usage: '[<key> <value>]' },
            args: [
                { id: 'key', type: 'string' },
                { id: 'value', match: 'rest' }
            ]
		});
    }
    
    async exec(message: Message, args: any) {
        const key = args.key ? args.key.toLowerCase() : null;
        let value = args.value;

        const client = await pool.connect();
        const guild = await client.query('SELECT * FROM guilds WHERE id = $1', [ message.guild?.id ]);

        if (!value || !key || ['prefix', 'nsfw'].indexOf(key) === -1) return message.channel.send(new MessageEmbed({
            thumbnail: { url: message.guild?.iconURL()?.toString() },
            fields: [
                { name: `Prefix (${guild.rows[0].prefix || config.prefix})`, value: 'The bot\'s command prefix.' },
                { name: `NSFW (${guild.rows[0].nsfw || config.nsfw})`, value: 'If the bot should show NSFW media (H). Options:\n - `none`: show no nsfw media in any channel\n - `limited`: show nsfw media in nsfw channels\n - `all`: show nsfw media in all channels' }
            ]
        }));

        if (key === 'prefix') {
            if (value.length >= 8) return message.channel.send('Prefix must be shorter than 8 characters.');

            await message.react('✅');
            await client.query('UPDATE guilds SET prefix = $1 WHERE id = $2', [value, message.guild?.id]);
        }

        if (key === 'nsfw') {
            if (['none', 'limited', 'all'].indexOf(value.toLowerCase()) === -1) return message.channel.send('Invalid Config option.');

            await message.react('✅');
            await client.query('UPDATE guilds SET nsfw = $1 WHERE id = $2', [value.toLowerCase(), message.guild?.id]);
        }
    }
}