const Discord = require('discord.js');

module.exports.aliases = ['a'];
module.exports.run = async (client, message, args) => {
	if (message.deletable) message.delete({ timeout: 5000 });

	if (!args[0]) { 
		const m = await message.channel.send('Command Usage:\n`!anime my hero academia`: information on my hero academia\n`!anime -short my hero academia`: description, genre, and watch links\n`!anime -adult itadaki`: adult anime, only works in nsfw channels or servers without scanning\n');
		if (m.deletable) m.delete({ timeout: 10000 });
		return;
	};

	if (args[0].toLowerCase() === '-short') {
		short = true;
		args.shift();
	} else { short = false };

	if (args[0].toLowerCase() === '-adult') {
		adult = true;
		args.shift();
	} else { adult = false };

	const search = args.join(' ');
	const query = `
		query ($page: Int, $perPage: Int) { 
			Page(page: $page, perPage: $perPage) {
				media(search: "${search}", type: ANIME, isAdult: ${adult}, sort: POPULARITY_DESC) {
					id
					isAdult
					status
					format
					season
					seasonYear
					episodes
					duration
					genres
					description
					bannerImage
					meanScore
					averageScore
					popularity
					favourites
					siteUrl
					studios {
						nodes {
							name
						}
					}
					startDate {
						year
						month
					}
					streamingEpisodes {
						url
						site
					}
					nextAiringEpisode {
						episode
						timeUntilAiring
					}
					tags {
						name
						isMediaSpoiler
					}
					coverImage {
						extraLarge
						color
					}
					title {
						romaji
						english
					}
				}
			}
		}
		`;

		const mediaInfo = await client.utilities.fetch(query, { page: 1, perPage: 1 });
	
		if (!mediaInfo.data.Page.media[0]) {
			const m = await message.channel.send(`Anime \`${search}\` not found.`);
			if (m.deletable) m.delete({ timeout: 10000 });
			return;
		}

		const media = mediaInfo.data.Page.media[0];
		description = client.utilities.cleanHtml(media.description);

		if (short) description = `${description.slice(0, 350)} (Shortened Description)`;

		const embed = new Discord.MessageEmbed()
		.setColor(media.coverImage.color)
		.setAuthor(`${media.title.english ? media.title.english : media.title.romaji} (${media.meanScore ? media.meanScore : media.averageScore}%)`, 'https://anilist.co/img/icons/android-chrome-512x512.png', media.siteUrl)
		.setDescription(`\`\`\`${description}\`\`\``)
		.setImage(media.bannerImage)
        .setFooter(`${message.content} | Requested by ${message.author.tag}`)
        .setTimestamp();

		const genres = media.genres.map(genre => genre).join(', ')
		embed.addFields({ name: 'Genres', value: genres ? genres : 'No Genres', inline: false })

		const tags = media.tags.map(tag => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', ')
		embed.addFields({ name: 'Tags', value: tags ? tags : 'No Tags', inline: false })

		if (!short) {
			const studios = media.studios.nodes.map(studio => studio.name).join(', ');
			embed.addFields({ name: 'Studios', value: studios ? studios : 'No Studios', inline: false })
		};

		if (media.nextAiringEpisode) { episodes =  `${media.nextAiringEpisode.episode - 1}/${media.episodes ? media.episodes : '?'} (${media.duration}m)\nAiring in: ${client.utilities.seconds(media.nextAiringEpisode.timeUntilAiring)}` }
		else { episodes = `${media.episodes ? media.episodes : media.episodes} (${media.duration}m)` };
		embed.addFields({ name: 'Episodes', value: `${episodes ? episodes : media.episodes}`, inline: true })
	
		if (media.streamingEpisodes[0]) embed.addFields({ name: 'Watch', value: `[${media.streamingEpisodes[0].site}](${media.streamingEpisodes[0].url})`, inline: true, });

		const m = await message.channel.send(embed);
		client.utilities.reactionDelete(m, message, 20000);

};