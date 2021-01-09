const express = require('express');
// const os = require('os');
// const geoip = require('geoip-lite');
const app = express();

// const server = require('http').Server(app);
// const io = require('socket.io')(server);
//
// const device = require('express-device');
// app.use(device.capture());

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 8080, () => console.log(`tsey2.0 bb...`));
