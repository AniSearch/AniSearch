import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { inspect } from 'util';

export default class EvalCommand extends Command {
	constructor() {
		super('eval', {
            aliases: ['eval'],
            category: 'Dev',
            description: { usage: '<input>', content: 'Evaluate Code. (owner only)' },
            ownerOnly: true,
            args: [{ id: 'input', match: 'rest' }]
        });
	}
	
	async exec(message: Message, args: any) {
        if (!args.input) return message.channel.send(`Correct Usage: \`eval ${this.description.usage}\``);
        let result = null;
        let error = false;

        try {
            result = await eval(args.input);
        } catch (e) {
            result = e.toString();
            error = true;
        }

        const inputMessage = `Input:\`\`\`js\n${args.input}\n\`\`\``;
        let output = `${inputMessage} Output:\`\`\`js\n${error ? result : inspect(result)}\n\`\`\``;
        if (output.length > 2000) {
            console.log('Eval Output: (' + Date + ')');
            console.log(result);
            return message.react('✅');
        }

        const m = await message.channel.send(output);
        this.client.utilities.reactionDelete(message, m);
    };
}