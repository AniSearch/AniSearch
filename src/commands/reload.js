module.exports.run = async (client, message, args) => {

    if (message.author.id !== '496477678103298052') return;
    
    try { require('../../index').handle() } catch(e) { return message.channel.send('Error. ' + e.toString())};

    message.channel.send(`Reloaded.`);

};