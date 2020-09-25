const Discord = require('discord.js');

module.exports.run = async (client, message) => {

	const info = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`Commands`)
        .setDescription(`This server's prefix: \`${client.config.prefix}\``)
		.setThumbnail(client.user.avatarURL())
		.addFields({
			name: 'Anime',
			value: `Views information on the specified anime.\n\`${client.config.prefix}anime <options> <title>\`\n**Options:**\n\`\`\`-short: show only important information\n-adult: adult anime (nsfw channel or no message scanning server)\`\`\``
		}, {
			name: 'Link (INCOMPLETE)',
			value: `Linking and Unlinking your account\n\`${client.config.prefix}profile <discord user>\`: gets mal, anilist, and or kitsu profiles for someone\n\`${client.config.prefix}link <AniList | MAL | Kitsu>\`: links your account\n\`${client.config.prefix}unlink <AniList | MAL | Kitsu>\`: unlinks from a platform.\n\`${client.config.prefix}code [new code]\`: views or changes your private code for verification (only works in dms)`,
			inline: true
		},
		{
			name: 'Misc',
			value: `Various information\n\`${client.config.prefix}info\``,
			inline: true
		})
        .setFooter(`Requested by ${message.author.tag} | ${message.content}`);

	const m = await message.channel.send(info);
	client.utilities.reactionDelete(m, message, 20000);

};