const functions = require("firebase-functions")
const { server } = require("./server")

const bitsWalls = functions.https.onRequest(server);

module.exports={
    bitsWalls
}   
