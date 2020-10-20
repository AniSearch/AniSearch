const Discord = require('discord.js');

module.exports.run = async (client, message) => {

	const info = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`${client.config.prefix}help`, 'https://anilist.co/img/icons/android-chrome-512x512.png', 'https://github.com/MrScopes/AniSearch')
		.addFields({
			name: '\\> Anime Commands (2)',
			value: '`anime`, `character`'
		}, {
			name: '\\> Profile (2)',
			value: '`profile`, `link`'
		},
		{
			name: '\\> Misc (2)',
			value: '`help`, `info`'
		})
        .setFooter(`${message.content} | Requested by ${message.author.tag}`)
        .setTimestamp();

	const m = await message.channel.send(info);
	client.utilities.reactionDelete(m, message, 20000);

};