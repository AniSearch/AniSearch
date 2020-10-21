const Discord = require('discord.js');

module.exports.aliases = ['mal', 'anilist', 'kitsu'];
module.exports.description = 'View the mal, anilist, and kitsu profile of a user.';
module.exports.usage = '!profile MrScopes\n!profile MrScopes#5548\n!profile 496477678103298052\n!profile @MrScopes';
module.exports.run = async (client, message, args) => {

    if (message.deletable) message.delete({ timeout: 5000 });
    
    if (!args[0]) return message.channel.send(`\`!profile <user>\``);
    const user = await client.utilities.resolveMember(client, message, args);

    if (!user) return message.channel.send('User not found.');

    if (!await client.db.table('users').get(user.id)) return message.channel.send('That user is not linked any under platforms.');

    const platforms = await client.db.table('users').get(user.id).run();

    const embed = new Discord.MessageEmbed()
    .setColor('red')
    .setAuthor(`${user.user.tag}`, user.user.avatarURL())
    .setFooter(`${message.author.tag} | ${message.content}`, message.author.avatarURL())

    if (platforms.anilist) embed.addFields({ name: 'AniList', value: `[${platforms.anilist}](https://anilist.co/user/${platforms.anilist}/)`, inline: true });
    if (platforms.mal) embed.addFields({ name: 'MAL', value: `[${platforms.mal}](https://myanimelist.net/profile/${platforms.mal}/)`, inline: true });
    if (platforms.kitsu) embed.addFields({ name: 'Kitsu', value: `[User#${platforms.kitsu}](https://kitsu.io/users/${platforms.kitsu}/)`, inline: true });

    const m = await message.channel.send(embed);
    client.utilities.reactionDelete(m, message, 20000);

};