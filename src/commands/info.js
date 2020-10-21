const Discord = require('discord.js');

module.exports.description = 'Bot info.';
module.exports.usage = '!info';
module.exports.run = async (client, message) => {

	const info = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setURL('https://github.com/AniSearch')
		.setThumbnail(client.user.defaultAvatarURl)
		.addFields({
			name: 'Help',
			value: `run \`${client.config.prefix}help\` for help`
		}, {
			name: 'Stats:',
			value: `\`Servers\`: ${client.guilds.cache.size}\n\`Users\`: ${client.users.cache.size}\n\`Uptime\`: ${client.utilities.seconds(client.uptime / 1000)}`,
			inline: true
		}, {
			name: 'GitHub:',
			value: `[Link](https://github.com/MrScopes/AniSearch)`
		})
		.setFooter(`${message.author.tag} | ${message.content}`, message.author.avatarURL())

	const m = await message.channel.send(info);
	client.utilities.reactionDelete(m, message, 20000);

};