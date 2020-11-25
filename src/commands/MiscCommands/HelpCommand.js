const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { reactionDelete } = require('../../utilities.js');

module.exports = class HelpCommand extends Command {
    constructor() {
        super('help', {
           aliases: ['help'],
           description: { content: 'View commands or a certain command.' },
           category: 'Misc',
           args: [{ id: 'command', type: 'commandAlias' }]
        });
    }
    
    async exec(message, args) {
        if (!args.command) {
            const embed = new MessageEmbed({
                color: '#0099ff',
                footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
                timestamp: new Date(),
            });

            const categories = this.handler.categories.values();
			for (const category of categories) embed.addField(category.id, category.map(command => `\`${command.aliases[0]}\``).join(', '));

            const m = await message.channel.send(embed);
            reactionDelete(m, message);
        } else {
            const embed = new MessageEmbed({
                color: '#0099ff',
                title: `\`${args.command.aliases[0]}\``,
                description: args.command.description.content,
                footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
                timestamp: new Date(),
                fields: [{ name: 'Usage', value: `\`${this.handler.prefix}${args.command.aliases[0]}${args.command.description.usage ? ` ${args.command.description.usage}` : ''}\``, inline: true }]
            });

		    if (args.command.aliases.length > 1) embed.addField('Aliases', `${args.command.aliases.map(c => `\`${c}\``).join(', ')}`, true);
            
            const m = await message.channel.send(embed);
            reactionDelete(m, message);
        }
    }
}