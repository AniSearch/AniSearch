const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { reactionDelete, getCount } = require('../../utilities.js');
const humanize = require('humanize-duration');

module.exports = class InfoCommand extends Command {
	constructor() {
		super('info', {
            aliases: ['info'],
            category: 'Anime',
            description: { content: 'Bot Information.' }
        });
	}
	
	async exec(message) {
        const embed = new MessageEmbed({
            color: '#0099ff',
            title: this.client.user.tag,
            thumbnail: { url: this.client.user.avatarURL() },
            footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
            timestamp: new Date(),

            fields: [
                { name: 'Stats', value: `Servers: ${getCount(this.client, 'guilds')}\nUsers: ${getCount(this.client, 'users')} _(including bots)_\nUptime: ${humanize(this.client.uptime)}`, inline: false },
                { name: 'Repository', value: `[${this.client.config.repo.type}](${this.client.config.repo.link})`, inline: false }
            ]
            
        });

        const m = await message.channel.send(embed);
        reactionDelete(m, message);
	};

}