const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
	if (message.channel.type === 'dm') {
		const code = await client.db.table('users').get(message.author.id).getField('code');
		if (!args[0]) {
            if (!code) return message.channel.send('You don\'t have a code. Run the link command first, or add an argument.');
            message.channel.send(`Your code is \`${code}\`. You can change this by adding an argument to the command.`)
    	} else {
			const newCode = args[0].replace(/ /g, '');
			if (newCode.length > 32) return message.channel.send('Your code can\'t be longer than 32 characters.');
			if (newCode.length < 12) return message.channel.send('Your code must be longer than 12 characters.');

            try { await client.db.table('users').get(message.author.id).update({ code: newCode }).run();
			} catch(e) { await client.db.table('users').insert({ id: message.author.id, code: newCode }).run() };
			
			message.channel.send(`Updated your code to \`${await client.db.table('users').get(message.author.id).getField('code')}\`.`);
		}
		message.channel.send('Make sure to put this code in your ABOUT ME of the desired platform before attempting to link.');
    }
};