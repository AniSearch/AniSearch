import { MessageEmbed, MessageEmbedOptions, Message, GuildMember } from 'discord.js';
import { Media } from 'anilist.js'
import { Client } from './Client';

export class Embeds {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    private MediaBase = (json: Media) : MessageEmbedOptions => { 
        return ({
            author: { name: `${json.title?.english || json.title?.romaji} (${json.status})`, icon_url: 'https://anilist.co/img/icons/android-chrome-512x512.png' },
            image: { url: json.bannerImage?.toString() },
            color: json.coverImage?.color?.toString(),
            description: json.description ? this.client.utilities.cleanHTML(json.description) : 'No Description.',
            timestamp: new Date(),
        });
    }
 
    AnimeEmbed = (json: Media, member: GuildMember) => { 
        const embed = new MessageEmbed(this.MediaBase(json)).setFooter(`${member.user.tag} | anime`, member.user.displayAvatarURL());
    
        if (json.genres) embed.addField('Genres', json.genres.map((genre: any) => genre).join(', '), true);
    
        embed.addField('Additional Info', `
            __Episodes:__ ${json.episodes || '?'} (${json.duration || '?'}m) ${json.streamingEpisodes?.[0] ? `[${json.streamingEpisodes[0].site}](${json.streamingEpisodes[0].url})` : ''}
            __Popularity:__ ${json.popularity} (${json.favourites}❤️)
            __Score:__ ${json.averageScore}%
        `, false);
    
        if (json.tags) embed.addField('Tags', json.tags.map((tag: any) => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', '), false);
        if (json.studios?.edges?.[0]) embed.addField('Studios', json.studios.edges.map((studio: any) => studio.node.name).join(', '), false);
    
        return embed;
    }

    MangaEmbed = (json: Media, member: GuildMember) => { 
        const embed = new MessageEmbed(this.MediaBase(json)).setFooter(`${member.user.tag} | anime`, member.user.displayAvatarURL());
    
        if (json.genres) embed.addField('Genres', json.genres.map((genre: any) => genre).join(', '), true);
    
        embed.addField('Additional Info', `
            __Volumes:__ ${json.volumes || '?'} (${json.chapters || '?'} chapters)
            __Popularity:__ ${json.popularity} (${json.favourites}❤️)
             __Score:__ ${json.averageScore}%
        `, true);
    
        return embed;
    }

    ProfileEmbed = (json: { id: string, anilist: string, mal: string }, member: GuildMember) => {
        const embed = new MessageEmbed({
            author: { 
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL()
            },
            description: 'This user\'s profile links.',
            timestamp: new Date(),
        }).setFooter(`${member.user.tag} | profile`);

        if (json.anilist) embed.addField('AniList', `[${json.anilist}](https://anilist.co/user/${json.anilist}/)`, true);
        if (json.mal) embed.addField('MAL', `[${json.mal}](https://myanimelist.net/profile/${json.mal}/)`, true);

        return embed;
    }
}