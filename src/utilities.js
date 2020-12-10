module.exports.cleanHTML = (text) => {
	return text.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '').replace(/<i>/g, '').replace(/<\/i>/g, '');
};

module.exports.handleSpoilers = (text) => {
	function isMultiple(x, y) { return Math.round(x / y) / (1 / y) === x };
	const final = `${text.replace(/~!/g, '||').replace(/!~/g, '||')}`;
	const amount = final.split('||').length - 1;
	if (!isMultiple(amount, 2)) return `${final}||`;
	return final;
};

module.exports.characterName = (character) => {
	return `${character.name.first}${character.name.last ? ` ${character.name.last}` : ''}`;
};

module.exports.title = (title) => {
	return title.english || title.romaji;
};

module.exports.reactionDelete = async (botMessage, playerMessage) => {
	const filter = (reaction, user) => { return (['🗑️'].includes(reaction.emoji.name) && user.id === playerMessage.author.id )};
	
	if (botMessage.deletable) await botMessage.react('🗑️').catch(() => {});
	setTimeout( () => { botMessage.reactions.cache.get('🗑️').remove().catch(() => {}) }, 50000);

	const reactions = await botMessage.awaitReactions(filter, { max: 1, time: 50000 });
	if ((reactions.get('🗑️')) && botMessage.deletable) botMessage.delete().catch(() => {});
};

module.exports.getCount = (client, type) => {
	if (type === 'users') {
		let users = 0;
		client.guilds.cache.map(g => g.memberCount).forEach(count => users = users + count);
		return users;
	} else if (type === 'guilds') return client.guilds.cache.size;
};

module.exports.emoji = {  
	0: '0️⃣', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣', 10: '🔟' ,
	'0️⃣': 0, '1️⃣': 1, '2️⃣': 2, '3️⃣': 3, '4️⃣': 4, '5️⃣': 5, '6️⃣': 6, '7️⃣': 7, '8️⃣': 8, '9️⃣': 9, '🔟': 10
};