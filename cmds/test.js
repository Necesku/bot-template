const data = {
    name: "test",
    description: "no description >:)",
    options: []
}

async function run(interaction, bot) {

    interaction.createMessage({
        embed: {
            title: "Test",
            description: `This is test command to check you correctly configured bot. As you see, the bot is working correctly :)`,
            author: { // Author property
                name: interaction.member.user.username,
                icon_url: interaction.member.avatarURL
            },
            color: 0x5AE441,
            footer: {
                text: "lolz"
            }
        }
    });

}

module.exports = { data, run }