const fs = require("fs");
const path = require("path");


function addNewGuild(id) {
    const data = {
        globalCash: 0
    }
    fs.writeFile(path.join(__dirname, id + ".json"), JSON.stringify(data, null, 2), null, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

function deleteNewGuild(id) {
    fs.rm(path.join(__dirname, id + ".json"), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = { addNewGuild, deleteNewGuild }