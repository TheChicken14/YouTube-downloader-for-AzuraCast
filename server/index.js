// Setup
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 4000;
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const axios = require("axios").default
const config = require("./config.js")
    // Use CORS
app.use(cors());

const upload = async(info) => {
    const { title, video_id } = info
    fs.readFile(`./songs/youtube_${video_id}.mp3`, (err, data) => {
        const song = data.toString("base64")

        axios.post(`https://${config.azura_domain}/api/station/${config.station}/files`, {
                path: `upload/${title}.mp3`,
                file: song
            }, {
                headers: {
                    "X-API-Key": key,
                    "Accept": "application/json"
                }
            }).then(_ => console.log("done", _.data))
            .catch(_ => console.log(_.response.data))
    })
}

app.get('/download', async(req, res) => {
    var URL = req.query.URL;
    if (!URL) {
        return res.json({
            error: "No video provided"
        })
    }
    // Get Video ID
    const info = await ytdl.getBasicInfo(URL)
    let id = info.video_id

    if (fs.existsSync(`./songs/youtube_${id}.mp3`)) {
        return upload(info)
    }

    const file = ytdl(URL, {
        quality: 'highestaudio',
        begin: req.query.begin ? req.query.begin : "0ms"
    })
    let start = Date.now();

    console.log(`Downloading ${info.title}`)

    ffmpeg(file)
        .audioBitrate(128)
        .save(`${__dirname}/songs/youtube_${id}.mp3`)
        .on('progress', p => {
            console.log(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
            console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
            upload(info)
        })
});

// Listen
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});