const Eris = require("eris");
const { Constants } = require("eris");
const { guildID, statusChannel, statusUpdateDelay, token } = require("./config.json");
const path = require("path");
const dataManager = require("./data/dataManager");
const fs = require("fs");
const iconurl = "https://media.discordapp.net/attachments/1046459312068894732/1063491993960976464/o.o_1.png?width=572&height=572";
// ^^^ change iconurl to your bot icon url

const bot = new Eris(token,
    { 
        intents: [
            Constants.Intents.guilds
        ]   
    }
);
bot.on("ready", async () => {

    const commandsPath = path.join(__dirname, 'cmds');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = await bot.getCommands();

    if (!commands.length) {
        commandFiles.forEach(cmd => {
            const cmdFinalPath = path.join(commandsPath, cmd);
            const cmdFinalData = require(cmdFinalPath).data;
            console.log("Trying to register command: " + cmdFinalData.name);
            bot.createGuildCommand(guildID, {
                name: cmdFinalData.name,
                description: cmdFinalData.description,
                options: cmdFinalData.options
            });
        });
    }

    bot.editStatus("idle", { name: "If I just could get a girlfriend..." });
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
    if(interaction instanceof Eris.CommandInteraction) {
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