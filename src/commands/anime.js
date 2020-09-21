const Discord = require('discord.js');

const seconds = module.exports.seconds = (seconds) => {
	// ripped from stackoverflow
	const days = Math.floor(seconds / (24 * 60 * 60));
	seconds -= days * (24 * 60 * 60);
	const hours = Math.floor(seconds / (60 * 60));
	seconds -= hours * (60 * 60);
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	return (
		(0 < days ? days + 'd ' : '') +
		(0 < hours ? hours + 'h ' : '') +
		(0 < minutes ? minutes + 'h ' : '') +
		Math.round(seconds) +
		's'
	);
}

module.exports.aliases = ['a'];
module.exports.run = async (client, message, args) => {
	if (message.deletable)
		message.delete({
			timeout: 5000,
		});

	if (args[0])
		if (args[0].toLowerCase() === 'adult') {
			adult = true;
			args.shift();
		} else {
			adult = false;
		}

	const search = args.join(' ');
	if (!search) {
		const m = await message.channel.send(
			`Correct Usage: ${client.config.prefix}anime <name>.`
		);
		if (m.deletable)
			m.delete({
				timeout: 10000,
			});
		return;
	}

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

	const mediaInfo = await client.utilities.fetch(query, {
		page: 1,
		perPage: 1,
	});

	console.log(mediaInfo);

	if (!mediaInfo.data.Page.media[0]) {
		const m = await message.channel.send(`Anime ${search} not found.`);
		if (m.deletable)
			m.delete({
				timeout: 10000,
			});
		return;
	}

	const media = mediaInfo.data.Page.media[0];

	let title = [];
	title.push(media.title.romaji);
	if (media.title.english) title.push(` (${media.title.english})`);
	title = title.join('');

	let genres = [];
	for (i = 0; i < media.genres.length; i++) {
		genres.push(`${media.genres[i]}`);
	}
	genres = genres.join(', ');

	let tags = [];
	for (i = 0; i < media.tags.length; i++) {
		if (media.tags[i].isMediaSpoiler)
			tags.push(`||${media.tags[i].name}||`);
		if (!media.tags[i].isMediaSpoiler) tags.push(`${media.tags[i].name}`);
	}
	tags = tags.join(', ');

	let studios = [];
	for (i = 0; i < media.studios.nodes.length; i++) {
		studios.push(`${media.studios.nodes[i].name}`);
	}
	studios = studios.join(', ');

	let episode = [];
	if (media.nextAiringEpisode) {
		episode.push(
			`${media.nextAiringEpisode.episode - 1}/${
				media.episodes ? media.episodes : `?`
			}`
		);
	} else {
		episode.push(`${media.episodes}`);
	}
	episode.push(`(${media.duration}m)`);
	episode = episode.join(' ');

	const embed = new Discord.MessageEmbed()
		.setColor(media.coverImage.color)
		.setAuthor(title, media.coverImage.extraLarge, media.siteUrl)
		.setDescription(
			`\`\`\`${client.utilities.cleanHtml(media.description)}\`\`\``
		)
		.setImage(media.bannerImage)
		.addFields(
			{
				name: 'Genres',
				value: genres ? genres : '`No Genres`',
				inline: false,
			},
			{
				name: 'Tags',
				value: tags ? tags : '`No Tags`',
				inline: false,
			},
			{
				name: 'Studios',
				value: studios ? studios : '`No Studios`',
				inline: false,
			},
			{
				name: 'Average Score',
				value: `${
					media.meanScore ? media.meanScore : media.averageScore
				}%`,
				inline: true,
			},
			{
				name: 'Episodes',
				value: `${episode}`,
				inline: true,
			},
			{
				name: 'Season',
				value: `${media.season ? media.season : 'Unknown Month'} ${
					media.seasonYear ? media.seasonYear : media.startDate.year
				}`,
				inline: true,
			},
			{
				name: 'Status',
				value: `${media.status} (${media.format})`,
				inline: true,
			},
			{
				name: 'Popularity',
				value: `${media.popularity} users (${media.favourites} favorites)`,
				inline: true,
			}
		);

	if (media.nextAiringEpisode) {
		embed.addFields({
			name: 'Next Episode',
			value: `Episode ${media.nextAiringEpisode.episode} in ${seconds(
				media.nextAiringEpisode.timeUntilAiring
			)}`,
			inline: true,
		});
	}

	if (media.streamingEpisodes[0]) {
		embed.addFields({
			name: 'Watch',
			value: `[${media.streamingEpisodes[0].site}](${media.streamingEpisodes[0].url})`,
			inline: true,
		});
	}

	if (embed.length <= 1500) {
		const m = await message.channel.send(embed);
		client.utilities.reactionDelete(m, message, 20000);
		if (media.nextAiringEpisode)
			client.utilities.reactionNotify(
				client,
				m,
				message,
				2000000000,
				media
			);
	} else {
		const m = await message.channel.send(
			'The response is too long... I\'ll dm it to you.'
		);
		try {
			message.author.send(embed);
		} catch (e) {
			message.channel.send('I had an issue dming you.');
		}
		if (m.deletable)
			await m.delete({
				timeout: 5000,
			});
	}
};
