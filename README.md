# discord-bnr

Unofficial module, allows you to modify the banner into a gif of a bot.
Easy to use, come and discover this magnificent module.

> [!WARNING]
> The module is still in beta, so if you have any errors do not hesitate to communicate them to me from the [support server](https://discord.gg/wSTn9mXdYV)

## Here is an example of use
```js
const bannner = require("discord-bnr")
const botBanner = new banner(client)
bot.setBanner("file or link")
    .then(() => console.log("Banner correctly updated."))
    .catch(err => console.error(err))
```

## Here is an example in a discord command
```js
const { Client, Message } = require("discord.js")
const banner = require("discord-bnr")

module.exports = {
    name: "setbanner",
    description: "Allows you to modify the bot banner",
    owner: true,

    /**
     * @param {Client} client
     * @param {Message} message
     */

    execute: async (message, args, client) => {

        const bot = new banner(client)
        if (message.attachments.size > 0) {
            message.attachments.forEach(a => {
                bot.setBanner(a.url).then(() => message.channel.send("Modified banner.")).catch(err => {
                    if (err instanceof Error && err.message.includes("Error: 400")) {
                        message.channel.send("Please try again in a few minutes.")
                    } else {
                        console.error(err)
                        message.channel.send("Unknown error.")
                    }
                })
            })
        } else if (args.length) {
            let url = args.join(" ")
            bot.setBanner(url).then(() => message.channel.send("Modified banner.")).catch(err => {
                console.log(err)
                if (err instanceof Error && err.message.includes("Error: 400")) {
                    message.channel.send("Please try again in a few minutes.")
                } else {
                    console.error(err)
                    message.channel.send("Unknown error.")
                }
            })
        } else {
            message.channel.send("Please include an attached image or link.")
        }
    }
}
```

> [!NOTE]
> ## Useful links
> - [Discord](https://discord.gg/wSTn9mXdYV)
> - [Wiki](https://github.com/maxouoff/discord-bnr/wiki)
