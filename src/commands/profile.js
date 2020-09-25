const Discord = require('discord.js');

module.exports.aliases = ['mal', 'anilist', 'kitsu'];
module.exports.run = async (client, message, args) => {
    if (message.deletable) message.delete({ timeout: 5000 });

    if (!args[0]) return message.channel.send(`!profile <user>`);
    const user = await client.utilities.resolveMember(client, message, args);

    if (!user) return message.channel.send('User not found.');

    if (!await client.db.table('users').get(user.id)) return message.channel.send('That user is not linked any under platforms.');

    const platforms = await client.db.table('users').get(user.id).run();

    const embed = new Discord.MessageEmbed()
    .setColor('red')
    .setAuthor(`${user.tag}`, user.avatarURL())
    .setImage(user.avatarURL())
    .setFooter(`Requested by ${message.author.tag} | ${message.content}`)

    if (platforms.AniList) embed.addFields({ name: 'AniList', value: `[${platforms.AniList}](https://anilist.co/user/${platforms.AniList}/)`, inline: false });
    if (platforms.MAL) embed.addFields({ name: 'MAL', value: `[${platforms.MAL}](https://myanimelist.net/profile/${platforms.MAL}/)`, inline: false });
    if (platforms.Kitsu) embed.addFields({ name: 'Kitsu', value: `[User #${platforms.Kitsu}](https://kitsu.io/users/${platforms.Kitsu}/)`, inline: false });

    const m = await message.channel.send(embed);
    client.utilities.reactionDelete(m, message, 20000);

};