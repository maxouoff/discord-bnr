const fetch = require("node-fetch")
const fs = require("fs")
const { Client } = require("discord.js")

module.exports = class DiscordBanner {
    constructor(client) {
        if (!(client instanceof Client)) {
            throw new Error("Invalid Discord.js client provided.")
        }
        this.client = client
        this.retryAfter = 0
    }
    async setBanner(filePathOrUrl) {
        try {
            let newBanner;
            if (filePathOrUrl.startsWith('http')) {
                const response = await fetch(filePathOrUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image from ${filePathOrUrl}`);
                }
                newBanner = await response.buffer();
            } else {
                newBanner = fs.readFileSync(filePathOrUrl);
            }
            let response = await fetch("https://discord.com/api/v9/users/@me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${this.client.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    banner: `data:image/gif;base64,${newBanner.toString("base64")}`
                })
            })
            if (response.status === 400) {
                const retryAfter = parseInt(response.headers.get('Retry-After')) * 1000;
                throw new Error("Error: 400 | Please try again in a few minutes.");
            }
            if (!response.ok) {
                throw new Error("Failed to update banner.");
            }
            console.log("Your bot's banner has updated successfully.")
        } catch (err) {
            throw new Error(`An error has occurred: ${err}`);
        }
    }
}
