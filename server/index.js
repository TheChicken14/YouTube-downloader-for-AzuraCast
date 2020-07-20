// Setup
const express = require('express');
const http = require("http")
const port = process.env.PORT || 4000;
const config = require("./config.js")
const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);

const { download } = require("./functions")

io.on('connection', (socket) => {
    console.log('a connection!');
    socket.on("download", (url) => download(url, socket))
});

app.get('/download', async(req, res) => {
    var URL = req.query.URL;
    if (!URL) {
        return res.json({
            error: "No video provided"
        })
    }
    download(URL)
});

// Listen
server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});