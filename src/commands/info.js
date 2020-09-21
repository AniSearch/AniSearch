const Discord = require('discord.js');

module.exports.run = async (client, message) => {

	const info = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setURL('https://github.com/AniSearch')
		.setThumbnail(client.user.defaultAvatarURl)
		.addFields({
			name: 'Commands',
			value: '`!info`: various information on the bot\n`!ping:`view the bot\'s ping\n`!anime`: search an anime\n`!character`: search a character'
		}, {
			name: 'Stats:',
			value: `\`Servers\`: ${client.guilds.cache.size}\n\`Users\`: ${client.users.cache.size}\n\`Uptime\`: ${require('./anime.js').seconds(client.uptime / 1000)}`,
			inline: true
		}, {
			name: 'GitHub:',
			value: `[Link](https://github.com/MrScopes/AniSearch)`
		})

	const m = await message.channel.send(info);
	client.utilities.reactionDelete(m, message, 20000);

};