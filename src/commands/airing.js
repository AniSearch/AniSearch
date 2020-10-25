const Discord = require('discord.js');

module.exports.description = 'Searches for a specific anime.';
module.exports.usage = '!airing\n!airing MrScopes#5548\n!airing 496477678103298052';
module.exports.run = async (client, message, args) => {

    const user = (await client.utilities.resolveMember(message, input = args[0]) || message.member).user;
    if (!user) return message.channel.send('User not found.');

    const json = await client.db.table('anime').filter(client.db.row('users'));

    let anime = json.filter(j => j.users.includes(user.id));
    anime = anime.map(a => `\n• ${a.name}`);

    const embed = new Discord.MessageEmbed()
    .setAuthor(user.tag, user.avatarURL())
    .setDescription(`**Anime:**\n ${anime}`)
    .setThumbnail(user.avatarURL())
    .setFooter(`${message.author.tag} | ${message.content}`, message.author.avatarURL())
    .setTimestamp();

    const m = await message.channel.send(embed);
    client.utilities.reactionDelete(m, message);

};