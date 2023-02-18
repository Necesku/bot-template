const data = {
    name: "test",
    description: "no description >:)",
    options: []
}

async function run(interaction, bot) {

    const author = interaction.member;

    interaction.createMessage({
        embeds: [{
            title: "Test",
            description: `This is test command to check you correctly configured bot. As you see, the bot is working correctly :)`,
            author: { // Author property
                name: `${author.user.username}#${author.user.discriminator}`,
                iconURL: author.avatarURL()
            },
            color: 0x5AE441,
            footer: {
                text: "lolz"
            }
        }]
    });

}

module.exports = { data, run }