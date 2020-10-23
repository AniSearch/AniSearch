module.exports.run = async (client, message, args) => {

    if (message.author.id !== '496477678103298052') return;
    
    require('.../index.js').handle();

    message.channel.send(`Reloaded.`)

};