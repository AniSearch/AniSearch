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
}