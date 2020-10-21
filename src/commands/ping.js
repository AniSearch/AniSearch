module.exports.description = 'View the connection to discord.';
module.exports.usage = '!ping';
module.exports.run = async (client, message) => {

	const ping = await message.channel.send('Ping?');
	ping.edit(`:clock1030: Pong! ${ping.createdTimestamp - message.createdTimestamp}ms response\n${client.ws.ping}ms API Heartbeat :heart:`);

};