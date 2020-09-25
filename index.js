const { Client } = require('discord.js');
const { config } = require('process');
const client = new Client({ disableEveryone: true });
const { readdir } = require('fs').promises;

client.config = require('./src/config.json');
client.utilities = require('./src/utilities.js');
client.commands = new Map();

client.login(client.config.token);

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.db = require('rethinkdbdash')({db: 'AniSearch', port: 28015 });

    //require('./src/airing.js')(client);
});

client.on('message', async (message) => {
    if (message.author.bot) return;

    const prefixes = [client.config.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`];
    const prefix = prefixes.filter(p => message.content.toLowerCase().startsWith(p.toLowerCase()))[0];
    if (!prefix) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = client.commands.get(args.shift().toLowerCase());
    if (!command) return;

    try {
        await command.run(client, message, args);
    } catch (e) {
        client.users.cache.get('496477678103298052').send(e.toString());
        console.error(e);
    };

});

const handle = async () => {
    try {

        const commands = (await readdir('./src/commands/')).filter(e => e.endsWith('.js')).map(e => e.slice(0, -3));
        for (const c of commands) {
            const lCommand = c.toLowerCase();
            let {
                aliases,
                run
            } = require(`./src/commands/${c}`);

            if (!Array.isArray(aliases)) aliases = [];
            aliases = aliases.filter(a => a && typeof a === 'string');

            const commandObject = {
                name: c,
                aliases,
                run
            };

            client.commands.set(lCommand, commandObject);
            aliases.forEach(a => client.commands.set(a.toLowerCase(), commandObject));
        }

    } catch (e) {

        console.error(e);
        process.exit();

    }
};

handle();