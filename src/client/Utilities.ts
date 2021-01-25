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
     * @example
     * const m = await message.channel.send('Hi!');
     * this.client.utilities.reactionDelete(message, m);
     */
    async reactionDelete(userMessage: Message, botMessage: Message) {
        try {
            const filter = (reaction: MessageReaction, user: User) => (['🗑️'].includes(reaction.emoji.name) && user.id === userMessage.author.id);
        
            await botMessage.react('🗑️');
            setTimeout(() => botMessage.reactions.cache.get('🗑️')?.remove(), 50000);
        
            await botMessage.awaitReactions(filter, { max: 1, time: 50000 });
            userMessage.delete();
            botMessage.delete();
        } catch(e) {}
    }
    
    /** Cleans all HTML elements out of a string. */
    cleanHTML(html: string) {
        return html.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/<br>/g, '').replace(/<i>/g, '').replace(/<\/i>/g, '');
    }
}