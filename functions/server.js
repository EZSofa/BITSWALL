const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const config = require('./config.json')

const app = express();

if (config) {
    admin.initializeApp({
        credential: admin.credential.cert(config.credential),
        databaseURL: config.databaseURL
    });
} else {
    admin.initializeApp();
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.post('/health', async(req, res) => {
    res.json({ status: 'OK' });
});

app.get('/brickTemplates/:channelID', async(req, res) => {
    const channelID = req.params.channelID;
    console.log('channelID', channelID)
    admin.database().ref(`/bitsWalls/${channelID}/templates`).once('value')
        .then((snapshot) => {
            console.log(snapshot.val())
            res.status(200).send(snapshot.val());
            return;
        })
        .catch((error) => {
            res.status(500).send(error);
            return;
        });
});

app.post('/brickTemplates/:channelID', async(req, res) => {
    try {
        const channelID = req.params.channelID;

        console.log('Create Template');
        console.log('channelID', channelID);
        console.log('req.body', JSON.stringify(req.body));

        const brickTemplate = req.body || {};
        brickTemplate.createTime = new Date().toISOString();

        let template = await admin.database().ref(`/bitsWalls/${channelID}/templates`).push();
        brickTemplate.id = template.key;

        await template.set(brickTemplate);

        res.status(200).send(brickTemplate);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

app.put('/brickTemplates/:channelID', async(req, res) => {

    const channelID = req.params.channelID;
    console.log('Update Template');
    console.log('channelID', channelID);
    console.log('req.body', JSON.stringify(req.body));

    const brickTemplateID = req.body.id;

    if (!brickTemplateID) {
        res.status(403).send({
            "message": `can't not update for brick ID ${brickTemplateID}`
        })
        return;
    }

    admin.database().ref(`/bitsWalls/${channelID}/templates/${brickTemplateID}`).set(req.body)
        .then(() => {
            console.log('hij')
            res.status(200).send({
                message: 'success'
            })
            return;
        })
        .catch((err) => {
            res.status(500).send(err);
            return;
        })
})

app.post('/launching/:channelID', async(req, res) => {
    const channelID = req.params.channelID;
    const brickTemplateID = req.body.id;

    console.log('launch!!!');
    console.log('channelID', channelID);
    console.log('req.body', JSON.stringify(req.body));

    if (!brickTemplateID) {
        res.status(403).send({
            "message": "invalid bricks"
        });
        return;
    }

    admin.database().ref(`/bitsWalls/${channelID}/launching`).set(req.body)
        .then(async() => {
            await admin.database().ref(`/bitsWalls/${channelID}/templates/${brickTemplateID}`).set(req.body)
            res.status(200).send({
                message: 'launching success'
            });
            return;
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                message: err.message
            });
            return;
        })
})

// old api


// // build multiple CRUD interfaces:
// app.post('/bricks/:channelID', async(req, res) => {
//     try {
//         const channelID = req.params.channelID;
//         const bitsWall = req.body.bitsWall;
//         await admin.database().ref(`/bitsWalls/${channelID}`).set(bitsWall);

//         res.status(200).send({
//             message: `launch channel ${channelID}'s bricks successful`
//         })
//     } catch (e) {
//         res.status(500).send({
//             message: e.message
//         })
//     }
// })

// app.put('/bricks/:channelID/:brickIndex', async(req, res) => {
//     try {
//         const channelID = req.params.channelID;
//         const brickIndex = req.params.brickIndex;
//         const active = req.body.active

//         console.log('channelID', channelID)
//         console.log('brickIndex', brickIndex)
//         console.log('active', active)

//         // TODO valid for API
//         // const valid = true
//         const valid = true

//         if (!valid) {
//             res.status(500).send({
//                 message: `Request is invalid`
//             })
//         } else if (!channelID || !brickIndex) {
//             res.status(500).send({
//                 message: `can not recgnize `
//             })
//         } else {
//             await admin.database().ref(`/bitsWalls/${channelID}/bricks/${brickIndex}/active`).set(active)
//             res.status(200).send({
//                 message: `close brick successful `
//             })
//         }
//     } catch (e) {
//         res.status(500).send(e.message)
//     }
// });

module.exports = { server: app }