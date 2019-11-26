const functions = require('firebase-functions');
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
    res.json({status:'OK'});
});

// build multiple CRUD interfaces:
app.post('/:channelId', async (req, res) => {
    const channelId = req.params.channelId;
    const bitsWall = req.body.bitsWall;
    await admin.database().ref(`/bitsWalls/${channelId}`).set(bitsWall);
    res.json();
});

// Expose Express API as a single Cloud Function:
exports.bitsWalls = functions.https.onRequest(app);
