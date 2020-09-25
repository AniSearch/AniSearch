const Discord = require('discord.js');

module.exports.run = async (client, message) => {

	const info = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`Commands`)
        .setDescription(`This server's prefix: \`${client.config.prefix}\``)
		//.setThumbnail(client.user.defaultAvatarURl)
		.addFields({
			name: 'Anime',
			value: 'Views information on the specified anime.\n`${client.config.prefix}anime my hero academia` - pretty obvious\n`${client.config.prefix}anime adult itadaki seieki` - putting "adult" will have only H\n**Note: `adult` only works in nsfw channels or servers without scanning**'
		}, {
			name: 'Info',
			value: 'Various information\n`${client.config.prefix}info`',
			inline: true
        })
        .setFooter(`Requested by ${message.author.tag} | ${client.config.prefix}`);

	const m = await message.channel.send(info);
	client.utilities.reactionDelete(m, message, 20000);

};