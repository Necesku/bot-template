const { Client } = require("oceanic.js");
const oceanic = require("oceanic.js");
const { Constants } = require("oceanic.js");
const { guildID, statusChannel, statusUpdateDelay, token } = require("./config.json");
const path = require("path");
const dataManager = require("./data/dataManager");
const fs = require("fs");
const iconurl = "https://media.discordapp.net/attachments/1046459312068894732/1063491993960976464/o.o_1.png?width=572&height=572";
// ^^^ change iconurl to your bot icon url

function fix(str, length) {
    let spacesToAdd = length - str.length;
    if (spacesToAdd <= 0) return str;
    return str.padEnd(length-1, " ") + "|";
}

const bot = new Client(
    {
        auth: `Bot ${token}`,
        intents: [
            Constants.Intents.guilds
        ]   
    }
);
bot.on("ready", async () => {

    const commandsPath = path.join(__dirname, 'cmds');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(" - COMMANDS ------------------------------------");
    console.log(" | Removing commands...                        |");
    bot.application.bulkEditGuildCommands(guildID, []);
    console.log(" | Done.                                       |");

    commandFiles.forEach(cmd => {
        const cmdFinalPath = path.join(commandsPath, cmd);
        const cmdFinalData = require(cmdFinalPath).data;
        const msg0 = " | Trying to register command: " + cmdFinalData.name;
        const msgFinal = fix(msg0, 48);
        console.log(msgFinal);
        bot.application.createGuildCommand(guildID, {
            name: cmdFinalData.name,
            description: cmdFinalData.description,
            options: cmdFinalData.options
        });
    });
    console.log(" -----------------------------------------------");
    // setInterval(() => {
    //     bot.getMessages(statusChannel, { limit: 1 }).then(msgs => {
    //         const msg = msgs[0];
    //         if (msgs[0]) {
    //             if (msg.author.id == bot.user.id) msg.edit({
    //                 embed: {
    //                     author: {
    //                         name: "Panel",
    //                         icon_url: iconurl
    //                     },
    //                     title: "Status",
    //                     description: "soon lmfao",
    //                     color: 0xFFFFFF,
    //                     footer: {
    //                         text: `Note: The status updates every ${statusUpdateDelay} seconds`
    //                     }
    //                 }
    //             });
    //         } else {
    //             bot.createMessage(statusChannel, "Wait 10 seconds :3");
    //         }
    //     });
    // }, statusUpdateDelay*1000);

    console.log();
    console.log(" - INFO ----------");
    console.log(" | Bot is ready! |");
    console.log(" -----------------");
    console.log();

});

bot.on("error", (err) => {
    console.log(err);
});

bot.on("interactionCreate", async (interaction) => {
    if(interaction instanceof oceanic.CommandInteraction) {
        const cmdPath = path.join(__dirname, "cmds", interaction.data.name+".js");
        const cmdExists = fs.existsSync(cmdPath);
        if (cmdExists) {
            await require(cmdPath).run(interaction, bot);
        } else {
            interaction.createMessage({
                embed: {
                    title: "Error!",
                    description: `This command doesn't exist, contact an owner of this bot!`,
                    author: {
                        name: interaction.member.user.username,
                        icon_url: interaction.member.avatarURL
                    },
                    color: 0xE44144,
                    footer: {
                        text: "Discord of da owner: Necesku#0180" // change Necesku#0180 to your discord nick#tag
                    }
                }
            });
        }
    }
});

bot.on("guildCreate", async (guild) => {
    console.log(" - New Guild ------------------------------");
    console.log(" | Trying to add new guild to database... |");
    console.log(" ------------------------------------------");
    console.log(` GID: ${guild.id}`);
    console.log();
    dataManager.addNewGuild(guild.id);
});

bot.on("guildDelete", async (guild) => {
    console.log(" - Deleting Guild ------------------------------");
    console.log(" | Trying to delete guild from database...     |");
    console.log(" -----------------------------------------------");
    console.log(` GID: ${guild.id}`);
    console.log();
    dataManager.deleteNewGuild(guild.id);
});

bot.connect();

module.exports = bot;