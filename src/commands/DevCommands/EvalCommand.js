const { Command } = require('discord-akairo');
const { inspect } = require('util');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
            aliases: ['eval'],
            category: 'Dev',
            description: { usage: '<input>', content: 'Evaluate Code. (owner only)' },
            ownerOnly: true,
            args: [{ id: 'input', match: 'rest' }]
        });
	}
	
	async exec(message, args) {
        if (!args.input) return message.channel.send('Input is required');
        let result = null;
        let error = false;
        try {
            result = await eval(args.input);
        } catch (e) {
            result = e.toString();
            error = true;
        }
        const inputMessage = `Input:\`\`\`js\n${args.input}\n\`\`\``;
        const m = `${inputMessage} Output:\`\`\`js\n${error ? result : inspect(result)}\n\`\`\``;
        if (m.length > 2000) return message.channel.send(`${inputMessage} Output: \`\`\`\nOver 2000 characters\n\`\`\``);
        message.channel.send(m);
    };
}