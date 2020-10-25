const Discord = require('discord.js');

module.exports.description = 'View commands.';
module.exports.usage = '!help\n!help anime\n!help c';
module.exports.run = async (client, message, args) => {

	const commands = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`${client.config.prefix}help`, 'https://anilist.co/img/icons/android-chrome-512x512.png', 'https://github.com/MrScopes/AniSearch')
		.addFields({
			name: '\\> Anime Commands (3)',
			value: '`anime`, `character`, `airing`'
		}, {
			name: '\\> Profile (2)',
			value: '`profile`, `link`'
		},
		{
			name: '\\> Misc (4)',
			value: '`help`, `info`, `ping`, `eval`'
		})
        .setFooter(`${message.content} | Requested by ${message.author.tag}`)
		.setTimestamp();
		
	if (!args[0]) { 
		const m = await message.channel.send(commands);
		return;
	}

	const command = client.commands.get(args[0]);
	if (!command) return message.channel.send(`Command \`${args[0]}\` not found.`);

	const help = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setAuthor(`${command.name} Command`, 'https://anilist.co/img/icons/android-chrome-512x512.png', 'https://github.com/MrScopes/AniSearch')
		.setDescription(`${command.description}\n\n**Usage:**\n${command.usage}`)
		.setFooter(`${message.author.tag} | ${message.content}`, message.author.avatarURL())
		.setTimestamp();

	const m = await message.channel.send(help);
	client.utilities.reactionDelete(m, message);

};