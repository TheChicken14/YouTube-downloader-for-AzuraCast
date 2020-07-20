const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const upload = require("./upload")

module.exports = async(URL, socket) => {

    // Get Video ID
    const info = await ytdl.getBasicInfo(URL)
    let id = info.video_id
    console.log(id)

    if (fs.existsSync(`${__dirname}/../songs/youtube_${id}.mp3`)) {
        return upload(info)
    }

    var totalLength;

    const file = ytdl(URL, {
        quality: 'highestaudio',
        //begin: req.query.begin ? req.query.begin : "0ms"
    })
    file.on("info", (info, format) => totalLength = format.contentLength)
    file.on("progress", (_a, downloaded) => {
        socket.emit("progress", Math.round((downloaded / totalLength) * 100))
    })
    let start = Date.now();

    console.log(`Downloading ${info.title}`)

    ffmpeg(file)
        .audioBitrate(128)
        .save(`${__dirname}/../songs/youtube_${id}.mp3`)
        .on('progress', p => {
            //console.log(`${p.targetSize}kb downloaded`);
            console.log(p)
        })
        .on('end', () => {
            console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
            upload(info)
        })
}