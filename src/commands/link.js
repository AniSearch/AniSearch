const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports.description = 'Link your mal, anilist, or kitsu profile.';
module.exports.usage = '!link MAL MrScopes\n!link AniList MrScopes\n!link Kitsu 861207';
module.exports.run = async (client, message, args) => {
	
	if (message.deletable) message.delete({ timeout: 5000 });
	
	if (!args[1]) { 
		const m = await message.channel.send('`!link <AniList | MAL | Kitsu> <username/id>`');
		if (m.deletable) m.delete({ timeout: 10000 });
		return;
	};
	
	const platform = args[0].toLowerCase();

	if (platform !== 'anilist' && platform  !== 'mal' && platform  !== 'kitsu') {
		const m = await message.channel.send('Invalid Platform. Try `AniList`, `MAL`, or `Kitsu`.');
		if (m.deletable) m.delete({ timeout: 10000 });
		return;
	};

	const id = args[1];

	if (platform === 'anilist') {
		const query = `
			query {
				User(search: "${id}") {
					name
				}
			}
			`

		const json = await client.utilities.fetch(query, { page: 1, perPage: 1 });

		if (json.errors) return message.channel.send('Error: ' + json.errors[0].message);

	} else if (platform === 'mal') {
		const url = `https://api.jikan.moe/v3/user/${id}`;
		const req = await fetch(url);
		const json = await req.json();

		if (json.error) return message.channel.send('Error: ' + json.error);

	} else if (platform === 'kitsu') {
		const url = `https://kitsu.io/api/edge/users/${id}`;
		const req = await fetch(url);
		const json = await req.json();

		if (json.errors) return message.channel.send('Error: ' + json.errors[0].title + ' , Make sure you\'re using your id, not username.');

	};

	const obj = { [platform] : id };

	await client.db.table('users').get(message.author.id).update(obj);
	message.channel.send(`Linked \`${platform} : ${id}\` to \`${message.author.tag}\`.`);

};