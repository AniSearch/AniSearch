const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.deletable) message.delete({ timeout: 5000 });

    if (!args[0]) { 
		const m = await message.channel.send('`!link <AniList | MAL | Kitsu> <code> <username/id>`\nThe bot will DM your PERMANENT code, you will need to update your ABOUT ME on the respective site.\nGet your code by dming the bot "!code".');
		if (m.deletable) m.delete({ timeout: 10000 });
		return;
    };
    
    const platform = args[0].toLowerCase();

    if (platform !== 'anilist' && platform  !== 'mal' && platform  !== 'ketsu') {
		const m = await message.channel.send('Invalid Platform. Try `AniList`, `MAL`, or `Ketsu`.');
		if (m.deletable) m.delete({ timeout: 10000 });
		return;
    };

    const code = await client.db.table('users').get(message.author.id).getField('code');

    const newCode = requrie('random-key-generator')(16);

    if (await client.db.table('users').get(message.author.id).getField(platform))
    if (!code) {

        try { await client.db.table('users').get(message.author.id).update({ code: newCode }).run();
        } catch(e) { await client.db.table('users').insert({ id: message.author.id, code: newCode }).run() };
 
        try { message.author.send(`Your code is \`${newCode}\`. Make sure to update it on \`${platform}\`. You can see and change this code at any time here with \`${client.config.prefix}code\`.`);
        } catch(e) { message.reply(`I couldn't dm you your code. Please enable dms then try again.`) };

    } else {
        if (message.channel.type !== 'dm') return message.channel.send('For security, you must input your code via dm\'s.');

        if (!args[2]) return message.channel.send('');

        const attemptedCode = args[1];
        if (code !== attemptedCode) return message.channel.send('Wrong code.');

        const id = args[2];

        if (platform === 'anilist') {
            const query = `
            query {
                Page(page: 1, perPage: 1) {
                users(name: "${id}") {
                    name
                    id
                    about
                    siteUrl
                }
                }
            }
            `
            const json = await client.utilities.fetch(query, { page: 1, perPage: 1 });
            if (!json.data.Page.users[0].about.contains(code)) return message.channel.send('The ABOUT ME was missing your code.');

        } else if (platform === 'mal') {
            const url = `https://api.jikan.moe/v3/user/${id}`;
            const req = await fetch(url, options);
            const json = await req.json();

            if (!json.about.contains(code)) return message.channel.send('The ABOUT ME was missing your code.');

        } else if (platform === 'ketsu') {
            const url = `https://kitsu.io/api/edge/users/${id}`;
            const req = await fetch(url, options);
            const json = await req.json();

            if (!json.data.attributes.about.contains(code)) return message.channel.send('The ABOUT ME was missing your code.');

        };

    };

    try { await client.db.table('users').get(message.author.id).update({ platform: id }).run();
    } catch(e) {  await client.db.table('users').insert({ id: message.author.id, platform: id }).run() };


};