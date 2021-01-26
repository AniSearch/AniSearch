import { Guild } from 'discord.js';
import { GuildMember } from 'discord.js';
import { User, Message, MessageReaction } from 'discord.js';
import { Client } from './Client';

export class Utilities {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * React with 🗑️ to delete the message.
     * @param userMessage the original message
     * @param botMessage the bot's message
     * @param time the amount of time to wait in ms, defaults to 50000 (50s)
     * @example
     * const m = await message.channel.send('Hi!');
     * this.client.utilities.reactionDelete(m, message);
     * // this.client.utilities.reactionDelete(m, message, 30000);
     */
    async reactionDelete(userMessage: Message, botMessage: Message, time = 50000) {
        try {
            const filter = (reaction: MessageReaction, user: User) => (['🗑️'].includes(reaction.emoji.name) && user.id === userMessage.author.id);
        
            await botMessage.react('🗑️');
            setTimeout(() => { botMessage.reactions.cache.get('🗑️')?.remove() }, time);
        
            const reactions = await botMessage.awaitReactions(filter, { max: 1, time });
            if (!reactions.get('🗑️') && botMessage.deletable) return;
            
            userMessage.delete();
            botMessage.delete();
        } catch(e) {}
    }
    
    /** Cleans all HTML elements out of a string. */
    cleanHTML(html: string) {
        return html.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '').replace(/<i>/g, '').replace(/<\/i>/g, '');
    }

    /**
     * Custom resolveMember utilities since akairo's isn't very good.
     * @param input the input
     * @param guild the guild to resolve the member in
     * @example
     * const member = await this.client.utilities.resolveMember(message, args[0]) || message.member;
     */
    async resolveMember(message: Message, input?: string): Promise<GuildMember> {
        try {
            const member = 
                message.mentions.members.first() ||
                await message.guild.members.fetch(input || '1') || 
                message.guild.members.cache.find(member => member.user.tag.toLowerCase() === input.toLowerCase());

            return member || null;
        }
        catch(e) { 
            return null;
        }
    }
}