const { inspect } = require('util');

module.exports.description = 'Evaluates code. (developer only)';
module.exports.usage = '!eval message.channel.send(`${client.ws.ping}`);';
module.exports.run = async (client, message, args) => {

    if (message.author.id !== '496477678103298052') return;
    const input = args.join(' ');
    if (!input) return message.channel.send('Input is required');
    let result = null;
    let error = false;
    try {
        result = await eval(input);
    } catch (e) {
        result = e.toString();
        error = true;
    }
    const inputMessage = `Input:\`\`\`js\n${input}\n\`\`\``;
    const m = `${inputMessage} Output:\`\`\`js\n${error ? result : inspect(result)}\n\`\`\``;
    if (m.length > 2000) return message.channel.send(`${inputMessage} Output: \`\`\`\nOver 2000 characters\n\`\`\``);
    message.channel.send(m);
    
};