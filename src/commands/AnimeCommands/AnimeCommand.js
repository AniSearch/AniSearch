const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { getMedia, searchMedia } = require('anilist-js');
const { emoji, title, cleanHTML, reactionDelete } = require('../../utilities.js');
const humanize = require('humanize-duration');

module.exports = class AnimeCommand extends Command {
	constructor() {
		super('anime', {
            aliases: ['anime', 'a'],
            category: 'Anime',
            description: { usage: '<anime>', content: 'Search an Anime.' },
            args: [{ id: 'anime', match: 'rest' }]
        });
	}
	
	async exec(message, args) {
        if (!args.anime) return message.channel.send('Correct Usage: `anime <anime>`');
        
        const search = await searchMedia({ search: args.anime, perPage: 10, sort: 'POPULARITY_DESC', type: 'ANIME' });
        if (!search[0]) return message.channel.send('Anime not found.');

        if (!search[1]) return animeMessage(message, search[0].id);

        let results = [];

        for (let i = 0; i < 10; i++) { if (search[i]) results.push(`${emoji[i + 1]} ${title(search[i].title)}`) };

        const embed = new MessageEmbed({
            author: { name: `Search results for ${args.anime}` },
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
            
            return animeMessage(message, id);
        };
    };
}

const animeMessage = async (message, id) => {
    const anime = await getMedia(id);
    if (!anime) return message.channel.send('Anime not found.');

    message.channel.send(`<${anime.siteUrl}>`);
    const embed = new MessageEmbed({
        color: anime.coverImage.color,
        author: { name: title(anime.title), icon_url: anime.coverImage.large, url: anime.siteUrl },
        description: `\`\`\`${cleanHTML(anime.description.trim()).length > 350 ? cleanHTML(anime.description.trim().slice(0, 350)) + '...' : cleanHTML(anime.description.trim())}\`\`\``,
        image: { url: anime.bannerImage },
        footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
        timestamp: new Date(),

        fields: [
            { name: 'Genres', value: anime.genres ? anime.genres.map(genre => genre).join(', ') : 'No Genres', inline: false },
            { name: 'Tags', value: anime.tags ? anime.tags.map(tag => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', ') : 'No Tags', inline: false },
            { name: 'Information', value: `Aired (m/d/y): **${anime.startDate.month || '?'}/${anime.startDate.day || '?'}/${anime.startDate.year || '?'} - ${anime.endDate.month || '?'}/${anime.endDate.day || '?'}/${anime.endDate.year || '?'}**\nPopularity: **${anime.popularity || '?'}** (**${anime.favourites || '?'}**❤️)\nScore: **${(anime.averageScore || anime.meanScore) || '?'}%**\n\n**Episodes:** ${anime.nextAiringEpisode ? `${anime.nextAiringEpisode.episode - 1} (${humanize(anime.nextAiringEpisode.timeUntilAiring * 1000)})/` : ''}${anime.episodes || '?'} _(${anime.duration || '?'}m)_ ${(anime.streamingEpisodes).length > 0 ? `\n[Watch on ${anime.streamingEpisodes[0].site}](${anime.streamingEpisodes[0].url})` : ''}`, inline: false }
        ]

    });

    const animeM = await message.channel.send(embed);
    reactionDelete(animeM, message);
}