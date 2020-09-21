const Discord = require('discord.js');

module.exports = async (client) => {

    const query = `
    query ($id: String) {
      Page(page: 1, perPage: 1) {
        media(id: $id, type: ANIME, sort: POPULARITY_DESC, status: RELEASING) {
          id
          siteUrl
          coverImage {
            extraLarge
            color
          }
          nextAiringEpisode {
            episode
            airingAt
          }
          title {
            romaji
            english
          }
        }
      }
    }
    `
    

    /*
    for (let [key, value] of test) {
        test.forEach(async (u) => {
            mediaInfo = await client.utilities.fetch(null, null, query, parseInt(key));
            media = mediaInfo.data.Page.media[0];

            const notify = () => setTimeout( async () => {
                embed = new Discord.MessageEmbed()
                .setColor(media.coverImage.color)
                .setAuthor(media.title.romaji, media.coverImage.extraLarge, media.siteUrl)
                .setDescription(`Episode ${media.nextAiringEpisode.episode} of ${media.title.romaji} aired.`)
                .setImage(media.coverImage.extraLarge)
                client.users.cache.get(u).send(embed);
            }, media.nextAiringEpisode.timeUntilAiring * 1000);
            notify()
        });
    }
    */

};