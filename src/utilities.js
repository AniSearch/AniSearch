const fetch = require('node-fetch');

module.exports.cleanHtml = (text) => {
	return text
		.replace(/<b>/g, '')
		.replace(/\/b>/g, '')
		.replace(/<br>/g, '')
		.replace(/<i>/g, '')
		.replace(/\/n/g, '');
};

module.exports.reactionDelete = async (botMessage, playerMessage, timeout) => {
	const filter = (reaction, user) => {
		return (
			['🗑️'].includes(reaction.emoji.name) &&
			user.id === playerMessage.author.id
		);
	};

	if (botMessage.deletable) botMessage.react('🗑️');

	botMessage
		.awaitReactions(filter, {
			max: 1,
			time: timeout,
		})
		.then((collected) => {
			if (collected.first().emoji.name === '🗑️') {
				if (botMessage.deletable) botMessage.delete();
			}
		})
		.catch((collected) => {
			if (botMessage.deletable)
				botMessage.reactions.cache.get('🗑️').remove();
		});
};

module.exports.reactionNotify = async () => {
/*
	client,
	botMessage,
	playerMessage,
	timeout,
	media
) => {
	const filter = (reaction, user) => {
		return ['❗'].includes(reaction.emoji.name) && !user.bot;
	};

	if (botMessage.deletable) botMessage.react('❗');

	botMessage
		.awaitReactions(filter, {
			max: 1,
			time: timeout,
		})
		.then((collected) => {
			if (collected.first().emoji.name === '❗') {
				if (false) {
					playerMessage.author.send(
						`I'll start notifying you when ${media.title.romaji} episodes air.`
					);
				} else {
					playerMessage.author.send(
						`I'll no longer notify you when ${media.title.romaji} episodes air.`
					);
				}
			}
		});
*/
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
	return (
		(0 < days ? days + 'd ' : '') + (0 < hours ? hours + 'h ' : '') + (0 < minutes ? minutes + 'h ' : '') + Math.round(seconds) + 's');

}

module.exports.resolveMember = async (client, message, args) => {
	try {
		const mention = message.mentions.users.first();
		if (mention) return mention;

		if (client.users.cache.get(args[0])) return client.users.cache.get(args[0]);

		const userTag = client.users.cache.find(u => u.tag === args[0]);
		if (userTag) return userTag;

		const userName = client.users.cache.find(u => u.username === args[0]);
		if (userName) return userName;

		return false;
	} catch (e) { return false };
};