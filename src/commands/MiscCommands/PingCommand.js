const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
    constructor() {
        super('ping', {
           aliases: ['ping'],
           description: { content: 'View the bot latency to discord.' },
           category: 'Misc'
        });
    }
    
    async exec(message) {
        const ping = await message.channel.send('Ping?');
        ping.edit(`:clock1030: Pong! ${ping.createdTimestamp - message.createdTimestamp}ms response\n${this.client.ws.ping}ms API Heartbeat :heart:`);
    }
}