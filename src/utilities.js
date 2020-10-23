const fetch = require('node-fetch');

module.exports.cleanHtml = (text) => {
	return text
		.replace(/<b>/g, '')
		.replace(/<\/b>/g, '')
		.replace(/<br>/g, '')
		.replace(/<i>/g, '')
		.replace(/<\/i>/g, '')
};

module.exports.reactionDelete = async (botMessage, playerMessage) => {

	const filter = (reaction, user) => { return (['🗑️'].includes(reaction.emoji.name) && user.id === playerMessage.author.id )};
	
	if (botMessage.deletable) await botMessage.react('🗑️');

	const reactions = await botMessage.awaitReactions(filter, { max: 1, time: 10000 });
	
	if (reactions.get('🗑️')) 
	if (botMessage.deletable) 
	botMessage.delete();

	setTimeout( () => { try { botMessage.reactions.cache.get('🗑️').remove() } catch (e) { }}, 10000);

};

module.exports.fetch = async (query, variables) => {
	const url = 'https://graphql.anilist.co',
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: {
					variables,
				},
			}),
		};

	const req = await fetch(url, options);
	const json = await req.json();

	return json;
};

module.exports.seconds = (seconds) => {

	const days = Math.floor(seconds / (24 * 60 * 60));
	seconds -= days * (24 * 60 * 60);
	const hours = Math.floor(seconds / (60 * 60));
	seconds -= hours * (60 * 60);
	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	return ((0 < days ? days + 'd ' : '') + (0 < hours ? hours + 'h ' : '') + (0 < minutes ? minutes + 'h ' : '') + Math.round(seconds) + 's');

}

module.exports.resolveMember = async (message, input) => {
	const member = 
	message.mentions.members.first() || 
	message.guild.members.cache.get(input) || 
	message.guild.members.cache.find(m => m.user.tag === input);
	message.guild.members.cache.find(m => m.user.username === input);
	message.guild.members.cache.find(m => m.nickname === input);

	return member;
};