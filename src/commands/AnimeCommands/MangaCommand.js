const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const { getMedia, searchMedia } = require('anilist-js');
const { emoji, title, cleanHTML, reactionDelete } = require('../../utilities.js');
const humanize = require('humanize-duration');

module.exports = class MangaCommand extends Command {
	constructor() {
		super('manga', {
            aliases: ['manga', 'm'],
            category: 'manga',
            description: { usage: '<manga/novel>', content: 'Search for a manga or light novel.' },
            args: [{ id: 'manga', match: 'rest' }]
        });
	}
	
	async exec(message, args) {
        if (!args.manga) return message.channel.send('Correct Usage: `manga <manga/novel>`');
        
        const search = await searchMedia({ search: args.manga, perPage: 10, type: 'MANGA' });
        if (!search[0]) return message.channel.send('Manga not found.');

        if (!search[1]) return mangaMessage(message, search[0].id);

        let results = [];

        for (let i = 0; i < 10; i++) { if (search[i]) results.push(`${emoji[i + 1]} ${title(search[i].title)}`) };

        const embed = new MessageEmbed({
            author: { name: `Search results for ${args.manga}` },
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
            
            return mangaMessage(message, id);
        };
    };
}

const mangaMessage = async (message, id) => {
    const manga = await getMedia(id);
    if (!manga) return message.channel.send('manga not found.');

    message.channel.send(`<${manga.siteUrl}>`);
    const embed = new MessageEmbed({
        color: manga.coverImage.color,
        author: { name: (title(manga.title) + ' (MANGA)'), icon_url: manga.coverImage.large, url: manga.siteUrl },
        description: `\`\`\`${cleanHTML(manga.description.trim()).length > 350 ? cleanHTML(manga.description.trim().slice(0, 350)) + '...' : cleanHTML(manga.description.trim())}\`\`\``,
        image: { url: manga.bannerImage },
        footer: { text: `${message.author.tag} | ${message.content}`, icon_url: message.author.avatarURL()},
        timestamp: new Date(),

        fields: [
            { name: 'Genres', value: manga.genres ? manga.genres.map(genre => genre).join(', ') : 'No Genres', inline: false },
            { name: 'Tags', value: manga.tags ? manga.tags.map(tag => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', ') : 'No Tags', inline: false },
            { name: 'Information', value: `Aired (m/d/y): **${manga.startDate.month || '?'}/${manga.startDate.day || '?'}/${manga.startDate.year || '?'} - ${manga.endDate.month || '?'}/${manga.endDate.day || '?'}/${manga.endDate.year || '?'}**\nPopularity: **${manga.popularity || '?'}** (**${manga.favourites || '?'}**❤️)\nScore: **${(manga.averageScore || manga.meanScore) || '?'}%**\n\n**Episodes:** ${manga.nextAiringEpisode ? `${manga.nextAiringEpisode.episode - 1} (${humanize(manga.nextAiringEpisode.timeUntilAiring * 1000)})/` : ''}${manga.episodes || '?'} _(${manga.duration || '?'}m)_ ${(manga.streamingEpisodes).length > 0 ? `\n[Watch on ${manga.streamingEpisodes[0].site}](${manga.streamingEpisodes[0].url})` : ''}`, inline: false }
        ]

    });

    const mangaM = await message.channel.send(embed);
    reactionDelete(mangaM, message);
}