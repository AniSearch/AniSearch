module.exports.run = async (client, message, args) => {
    if (message.author.id !== '496477678103298052') return;
    const input = args[0].toLowerCase();
    if (!input) return message.channel.send('Input is required');

    const command = client.commands.get(input) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(input));

    if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\``);

    try {
        delete require.cache[require.resolve(`./${command.name}.js`)];
        const newCommand = require(`./${command.name}.js`);

        const commandObject = {
            name: command.name,
            aliases: newCommand.aliases ? newCommand.aliases : [],
            run: newCommand.run
        };

        client.commands.set(command.name, commandObject);

        delete require.cache[require.resolve('./../utilities.js')];
        client.utilities = require('./../utilities.js');
    } catch (error) {
        console.error(error);
        message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }

    message.channel.send(`Reloaded Utilities and \`${command.name}.js\`.`)

};