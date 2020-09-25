module.exports.run = async (client, message) => {

	const ping = await message.channel.send('Ping?');
	ping.edit(`:clock1030: Pong! ${ping.createdTimestamp - message.createdTimestamp}ms response`);

};