const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const {
    SERVER_PORT = 13000
} = process.env;

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));
app.use(router);
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bitsWallMap = {};
const bitsWallSettingsMap = {};
const channelClientsMap = {};

app.post('/createWall', (req, res) => {
    const {channelId, bitsWall} = req.body;
    bitsWallMap[channelId] = bitsWall;
    console.log(`channelId ${channelId} create wall`);
    console.log(`bitsWall ${JSON.stringify(bitsWall)}`);
    const clients = channelClientsMap[channelId];

    if(clients && clients.length){
        for(let c of clients){
            console.log('create wall update wall');
            c.emit('updateWall', bitsWallMap[channelId]);
        }
    }
    res.json(bitsWall);
});

app.get('/bitsWallMap', (req, res) => {
    res.json(bitsWallMap);
});

app.get('/channelClientsMap', (req, res) => {
    res.json(channelClientsMap);
});

app.post('/bitsWallSettings', (req, res) => {
    const {settings, channelId} = req.body;
    bitsWallSettingsMap[channelId] = settings;
    return res.json(bitsWallSettingsMap[channelId]);
});

app.get('/bitsWallSettings', (req, res) => {
    const {channelId} = req.query;
    return res.json(bitsWallSettingsMap[channelId]);
});

app.get('/update', (req, res) => {
    const channelId = req.query.channelId;
    const clients = channelClientsMap[channelId];
    if (clients) {
        console.log('update clients');
        for (let c of clients) {
            c.emit('updateWall', {a: 'apple'}, 123);
        }
    }

    res.json();
});

app.get('/health', (req, res) => {
    res.json({
        status: 'running'
    });
});

let server = http.listen(SERVER_PORT, function () {
    const host = server.address().address;
    console.log("awstwitch at http://%s:%s", host, SERVER_PORT);
});

io.on('connection', function (socket) {
    let _channelId;

    socket.on('register', function (channelId) {
        _channelId = channelId;
        let clients = channelClientsMap[channelId];
        if (!clients) {
            clients = []
            channelClientsMap[channelId] = clients;
        }
        clients.push(socket);
        socket.emit('updateWall', bitsWallMap[_channelId]);
        console.log(`channelId:${_channelId} register socketId:${socket.id}`);
    });

    socket.on('breakBrick', function (channelId, brickId) {
        const clients = channelClientsMap[channelId];

        //break brick
        const bitsWall = bitsWallMap[channelId];
        for (let brick of bitsWall) {
            if (brick.id === brickId) {
                brick.active = false;
            }
        }

        if (clients && clients.length) {
            for (let s of clients) {
                s.emit('updateWall', bitsWallMap[_channelId], brickId);
                console.log(`breakBrick channelId:${_channelId} brick:${brickId}`);
            }
        }
    });

    socket.on('disconnect', function () {
        let clients = channelClientsMap[_channelId];
        if (clients && clients.length) {
            let i = clients.indexOf(socket);
            clients.splice(i, 1);
            console.log(`ChannelId:${_channelId} socketId:${socket.id} disconnect.`);
        }
    });
});