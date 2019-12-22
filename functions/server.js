const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const app = express();

admin.initializeApp();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.post('/health', async (req, res) => {
    res.json({ status: 'OK' });
});

// build multiple CRUD interfaces:
app.post('/bricks/:channelID', async (req, res) => {
    try {
        const channelID = req.params.channelID;
        const bitsWall = req.body.bitsWall;
        await admin.database().ref(`/bitsWalls/${channelID}`).set(bitsWall);

        res.status(200).send({
            message: `launch channel ${channelID}'s bricks successful`
        })
    }
    catch (e) {
        res.status(500).send({
            message: e.message
        })
    }
})

app.put('/bricks/:channelID/:brickIndex', async (req, res) => {
    try {
        const channelID = req.params.channelID;
        const brickIndex = req.params.brickIndex;
        const active = req.body.active

        console.log('channelID', channelID)
        console.log('brickIndex', brickIndex)
        console.log('active', active)

        // TODO valid for API
        // const valid = true
        const valid = true

        if (!valid) {
            res.status(500).send({
                message: `Request is invalid`
            })
        }
        else if (!channelID || !brickIndex) {
            res.status(500).send({
                message: `can not recgnize `
            })
        } else {
            await admin.database().ref(`/bitsWalls/${channelID}/bricks/${brickIndex}/active`).set(active)
            res.status(200).send({
                message: `close brick successful `
            })
        }
    }
    catch(e){
        res.status(500).send(e.message)
    }
});

module.exports = { server: app }
