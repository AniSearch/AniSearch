# AniSearch
Search info on Anime and Manga via Discord.\
**CURRENLTY INCOMPLETE!**

# src/config.json
Example:
```js
{ 
    "token": "xxx",
    "ownerID": "496477678103298052",
    "postgres": {
        "host": "1234",
        "port": 5432,
        "database": "anisearch",
        "user": "admin",
        "password": "1234"
    },
    "defaultConfig": {
        "prefix": "!",
        "nsfw": "limited"
    }
}
```

# database tables
- guilds (id text, prefix text, nsfw text)
- users (id text, anilist text, mal text)