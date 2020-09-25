const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.deletable) message.delete({ timeout: 5000 });

    if (!args[0]) { 
		const m = await message.channel.send('`!link <AniList | MAL | Kitsu>`\nThe bot will DM your PERMANENT code, you will need to update your ABOUT ME on the respective site.\nGet your code by dming the bot "!code".');
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

    if (!code) try {
        await client.db.table('users').get(message.author.id).update({ code: newCode }).run();
    } catch(e) { 
        await client.db.table('users').insert({ id: message.author.id, code: newCode }).run();
    };
    
    try {

    } catch(e) {

    };

    try {
        await client.db.table('users').get(message.author.id).update({ platform: id }).run();
    } catch(e) { 
        await client.db.table('users').insert({ id: message.author.id, platform: id }).run();
    };


};