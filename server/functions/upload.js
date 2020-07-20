const axios = require("axios").default
const fs = require('fs');
const config = require("../config.js")

module.exports = async(info) => {
    const { title, video_id } = info
    fs.readFile(`${__dirname}/../songs/youtube_${video_id}.mp3`, (err, data) => {
        if (err) {
            return console.log(err)
        }
        const song = data.toString("base64")

        axios.post(`https://${config.azura_domain}/api/station/${config.station}/files`, {
                path: `upload/${title}.mp3`,
                file: song
            }, {
                headers: {
                    "X-API-Key": config.azura_key,
                    "Accept": "application/json"
                }
            }).then(_ => console.log("done", _.data))
            .catch(_ => console.log(_.response.data))
    })
}