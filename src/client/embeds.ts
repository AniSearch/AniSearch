import { Utilities } from '../utilities';

import { MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { Media } from 'anilist.js'

const MediaBase = (json: Media) : MessageEmbedOptions => { 
    return ({
        author: { name: `${json.title?.english || json.title?.romaji} (${json.status})`, icon_url: 'https://anilist.co/img/icons/android-chrome-512x512.png' },
        image: { url: json.bannerImage?.toString() },
        color: json.coverImage?.color?.toString(),
        description: json.description ? Utilities.cleanHTML(json.description) : 'No Description.',
        timestamp: new Date(),
    });
}

export const AnimeEmbed = (json: Media, size: 'small' | 'large' | 'massive') => { 
    const embed = new MessageEmbed(MediaBase(json));

    if (size && size !== 'small') {
        if (json.genres) embed.addField('Genres', json.genres.map((genre: any) => genre).join(', '), true);

        embed.addField('Additional Info', `
            __Episodes:__ ${json.episodes || '?'} (${json.duration || '?'}m) ${json.streamingEpisodes?.[0] ? `[${json.streamingEpisodes[0].site}](${json.streamingEpisodes[0].url})` : ''}
            __Popularity:__ ${json.popularity} (${json.favourites}❤️)
            __Score:__ ${json.averageScore}%
        `, false);
    }

    if (size === 'massive') {
        if (json.tags) embed.addField('Tags', json.tags.map((tag: any) => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', '), false);
        if (json.studios?.edges?.[0]) embed.addField('Studios', json.studios.edges.map((studio: any) => studio.node.name).join(', '), false);
    }

    return embed;
}

export const MangaEmbed = (json: Media, size: 'small' | 'large') => { 
    const embed = new MessageEmbed(MediaBase(json));

    if (size && size !== 'small') {
        if (json.genres) embed.addField('Genres', json.genres.map((genre: any) => genre).join(', '), true);

        embed.addField('Additional Info', `
            __Volumes:__ ${json.volumes || '?'} (${json.chapters || '?'} chapters)
            __Popularity:__ ${json.popularity} (${json.favourites}❤️)
            __Score:__ ${json.averageScore}%
        `, true);
    }

    return embed;
}