const Discord = require('discord.js');

module.exports.aliases = ['c'];
module.exports.run = async (client, message, args) => {

	if (message.deletable) message.delete({
		timeout: 5000
	});

	const search = args.join(' ');
	if (!search) {
		const m = await message.channel.send(`Correct Usage: \`${client.config.prefix}character <name>\`.`)
		if (m.deletable) m.delete({
			timeout: 10000
		});
		return;
	};

	const variables = {
		page: 1,
		perPage: 1,
		search: search
	};

	const query = `
		query ($search: String) { 
            Character(search: $search) {
                siteUrl
                description
                favourites
                media(type: ANIME, sort: POPULARITY_DESC) {
                    nodes {
                        id
                        siteUrl
                        coverImage {
                            color
                        }
                        title {
                            romaji
                            english
                        }
                    }
                }
                image {
                  large
                }
                name {
                  first
                  last
                  full
                  native
                }
              }
			}
		`

	const mediaInfo = await client.utilities.fetch(search, variables, query);

	if (!mediaInfo.data.Character) {
		const m = await message.channel.send(`Character \`${search}\` not found.`)
		if (m.deletable) m.delete({
			timeout: 10000
		});
		return;
	};

	const media = mediaInfo.data.Character;

	let description = media.description;
	if (description.length >= 750) {
		description = description.substring(1, 750);
		description = [description];
		description.push('(description too long)')
		description = description.join(' ');
	};

	description = description.replace(/~!/g, '||').replace(/!~/g, '||');

	let allMedia = [];
	for (i = 0; i < 5; i++) {
		if (media.media.nodes[i]) allMedia.push(`[${media.media.nodes[i].title.romaji}](${media.media.nodes[i].siteUrl})`);
	}
	allMedia = allMedia.join('\n');

	const embed = new Discord.MessageEmbed()
		.setAuthor(media.name.full, media.image.large, media.siteUrl)
		.setColor(media.media.nodes[0].coverImage.color)
		.setDescription(description)
		.setImage(media.image.large)
		.addFields({
			name: 'Media',
			value: allMedia,
			inline: true
		}, {
			name: 'Favorites',
			value: `\`${media.favourites}\``,
			inline: true
		})

	if (embed.length <= 1500) {
		const m = await message.channel.send(embed);
		client.utilities.reactionDelete(m, message, 20000);
	} else {
		const m = await message.channel.send('The response is too long... I\'ll dm it to you.');
		try {
			message.author.send(embed);
		} catch (e) {
			message.channel.send('I had an issue dming you.');
		};
		if (m.deletable) await m.delete({
			timeout: 5000
		});
	};

};