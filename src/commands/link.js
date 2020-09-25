const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.deletable) message.delete({ timeout: 5000 });

    if (!args[0]) return message.channel.send('`!link <AniList | MAL | Kitsu>`\nThe bot will DM you the code, you will need to update your ABOUT ME on the respective site.');
    if (args[0]) console.log()

};