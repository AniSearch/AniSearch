const Discord = require('discord.js');

module.exports = async (client) => {

	const query = `
		query ($id: Int) {
			Page(page: 1, perPage: 1) {
				media(id: $id, type: ANIME) {
					id
					siteUrl
					coverImage {
						extraLarge
						color
					}
					streamingEpisodes {
						title
						thumbnail
						url
						site
					}
					nextAiringEpisode {
						episode
						airingAt
						timeUntilAiring
					}
					title {
						romaji
						english
					}
				}
			}
		}
	`;
		
	let anime = await client.db.table('anime');
	let arr = new Map();
	anime.forEach(a => arr.set(a.id, a.users));
	
	const notifyUsers = async () => {
		for (let [anime, users] of arr) {
			users.forEach(async (u) => {
				const user = client.users.cache.get(u);
				const mediaInfo = await client.utilities.fetch(query, { id: parseInt(anime) });
				const media = mediaInfo.data.Page.media[0];

				setTimeout(() => {
					const embed = new Discord.MessageEmbed()
						.setColor(media.coverImage.color)
						.setAuthor(media.title.english || media.title.romaji, media.coverImage.extraLarge, media.siteUrl)
						.setDescription(`Episode ${media.nextAiringEpisode.episode} of ${media.title.romaji} aired.`)
						.addFields({ name: 'Watch', value: `[${media.streamingEpisodes[0].site}](${media.streamingEpisodes[0].url})`, inline: true, })
						.setImage(media.streamingEpisodes.thumbnail)
						.setTimestamp();
					try { const m = user.send(embed); m.react('❗')} catch (e) {};
					notifyUsers();
				}, media.nextAiringEpisode.timeUntilAiring * 1000);
			});
		}
		notifyUsers();
	};

	const notify = async (message, user) => {
		
		if (!message.embeds) return;
		const embed = message.embeds[0];

		const anime = { name: embed.author.name, id: (embed.author.url).split('/')[4] };

		const json = await client.db.table('anime').get(anime.id);

		if (!json) {
				await client.db.table('anime').insert({ id: anime.id, name: anime.name, users: [user.id] });
				return message.channel.send(`${user}, I'll notify you when ${anime.name} airs.`);
		}

		if (json.users.includes(user.id)) {
				let newArr = json.users;
				newArr = newArr.filter(a => a !== user.id);

				await client.db.table('anime').get(anime.id).update({ users: newArr });

				message.channel.send(`${user}, I'll no longer notify you when ${anime.name} airs.`);
		} else {

				let newArr = json.users;
				newArr.push(user.id);
				await client.db.table('anime').get(anime.id).update({ users: newArr });

				message.channel.send(`${user}, I'll notify you when ${anime.name} airs.`);
		}

	};

	client.on('messageReactionAdd', async (reaction, user) => {
			const message = reaction.message;
			if (message.partial) return;
			if (!message.embeds) return;
			if (reaction.emoji.name === '❗' && message.author === client.user && user !== client.user) notify(message, user);
	});

	client.on('messageReactionRemove', async (reaction, user) => {
			const message = reaction.message;
			if (message.partial) return;
			if (!message.embeds) return;
			if (reaction.emoji.name === '❗' && message.author === client.user && user !== client.user) notify(message, user);
	});

};