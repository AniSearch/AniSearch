import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
    constructor() {
		super('help', {
			category: 'Misc',
			aliases: ['help'],
            description: { content: 'View command information.', usage: '[command]' },
            args: [{ id: 'command', type: 'commandAlias' }]
		});
    }
    
    /** 
     * Get help for all or a certain command.
     * @example
     * !help
     * !help anime
    */
    async exec(message: Message, args: any) {
        if (!args.command) {
            const embed = new MessageEmbed({
                color: '#0099ff',
                footer: { text: `${message.author.tag} | ${this.aliases[0]}`, icon_url: message.author.avatarURL()?.toString()},
                timestamp: new Date(),
            });

            const categories = this.handler.categories.values();
			for (const category of categories) embed.addField(category.id, category.map(command => `\`${command.aliases[0]}\``).join(', '));

            const m = await message.channel.send(embed);
            this.client.utilities.reactionDelete(message, m);
        } else {
            const embed = new MessageEmbed({
                color: '#0099ff',
                title: `\`${args.command.aliases[0]}\``,
                description: args.command.description.content,
                footer: { text: `${message.author.tag} | help`, icon_url: message.author.avatarURL()?.toString()},
                timestamp: new Date(),
            });

            if (args.command.description.usage) Object.assign(embed, { fields: [{ name: 'Usage', value: `\`${args.command.aliases[0]} ${args.command.description.usage}\``, inline: true }] }); 

		    if (args.command.aliases.length > 1) embed.addField('Aliases', `${args.command.aliases.map((c: any) => `\`${c}\``).join(', ')}`, true);
            
            const m = await message.channel.send(embed);

        }
    }
}