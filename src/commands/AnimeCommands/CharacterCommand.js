const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { getCharacter, searchCharacters } = require('anilist-js');
const { emoji, handleSpoilers, characterName, title, cleanHTML, reactionDelete } = require('../../utilities.js');

module.exports = class CharacterCommand extends Command {
	constructor() {
		super('character', {
            aliases: ['character', 'c'],
            category: 'Anime',
            description: { usage: '<character>', content: 'Search a Character.' },
            args: [{ id: 'character', match: 'rest' }]
        });
	}
	
	async exec(message, args) {
        if (!args.character) return message.channel.send('Correct Usage: `character [options] <character>`');
        
        const search = await searchCharacters({ search: args.character, perPage: 10 });
        if (!search[0]) return message.channel.send('Character not found.');

        let results = [];

        for (let i = 0; i < 10; i++) { if (search[i]) results.push(`${emoji[i + 1]} ${characterName(search[i])} **(${search[i].favourites || 0}❤️)**`) };

        const embed = new MessageEmbed({
            author: { name: `Search results for ${args.character}` },
            description: results.join('\n') || 'No Results.',
            footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
            timestamp: new Date(),
        });        

        const m = await message.channel.send(embed);
		reactionDelete(m, message);
        m.delete({ timeout: 60000 }).catch(() => {});
        
        for (let i = 1; i <= search.length && !m.deleted; i++) { m.react(emoji[i]).catch(() => {}) };
        
        const filter = (reaction, user) => { return (emoji[reaction.emoji.name]) && (user.id === message.author.id) };
        
		const reactions = await m.awaitReactions(filter, { max: 1, time: 60000 });
            
        if (reactions.first()) {
            const number = emoji[reactions.first().emoji.name];
            m.delete().catch(() => {});
            const id = search[number - 1].id;
            
            const character = await getCharacter(id);
            if (!character) return message.channel.send('Character not found.');
            
            message.channel.send(`<${character.siteUrl}>`);
            
            const embed = new MessageEmbed({
                author: { name: `${characterName(character)} (${character.favourites || 0}❤️)`, icon_url: 'https://google.com', url: character.siteUrl },
                description: handleSpoilers(cleanHTML(character.description.trim()).length > 500 ? cleanHTML(character.description.trim().slice(0, 500)) + '...' : cleanHTML(character.description.trim())),
                image: { url: character.image.large },
                footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
                timestamp: new Date(),
        
                fields: [
                    { name: 'Top Anime', value: character.Anime ? `[${title(character.Anime.nodes[0].title)}](https://anilist.co/anime/${character.Anime.nodes[0].id})` : '', inline: true},
                    { name: 'Top Manga', value: character.Manga ? `[${title(character.Manga.nodes[0].title)}](https://anilist.co/manga/${character.Manga.nodes[0].id})` : '', inline: true},
                ]
        
            });
        
			const characterM = await message.channel.send(embed);
            reactionDelete(characterM, message);
        };

    };
}