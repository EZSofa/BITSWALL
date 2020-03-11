const _config = {
    domain: 'https://us-central1-bitswall-8478f.cloudfunctions.net/bitsWalls',
    firebaseConfig: {
        apiKey: "AIzaSyB3Huc_Jh4rSMEdvfa938kumjSYMAN4rbQ",
        authDomain: "bitswall-8478f.firebaseapp.com",
        databaseURL: "https://bitswall-8478f.firebaseio.com",
        projectId: "bitswall-8478f",
        storageBucket: "bitswall-8478f.appspot.com",
        messagingSenderId: "316414073936",
        appId: "1:316414073936:web:e397226b68f0251e110555",
        measurementId: "G-92F59Q18S8"
    }
}

let
    _state, // save some state
    _global, // save the const variable
    _api, // implement for API
    _action, // save every actions,
    _bits // twtichBits
    ;

$(document).ready(() => {

    // init global object, mean it's never change
    _global = initGlobal()

    // init state, variable in there will be changed
    _state = initState()

    // init API, launch HTTP Request 
    _api = initAPI(_config.domain);

    // init bits event
    _bits = initBits();

    // init Actions
    _action = initAction(_state, _global, _bits, _api);

    // register actions in bits's event
    registerBitsAction(_bits, _action);

    // fetch channel ID
    fetchChannelParameter(_state);

    // init fabric canvas
    initFabricCanvas(_state, _action);

    // init for firebase
    initFirebase(_state, _config.firebaseConfig, _action);

})

const initGlobal = function () {
    return new Global();
}

const initState = function () {
    return new State();
}

const initAPI = function (domain) {
    return new API(domain)
}

const initBits = function () {
    return window.Twitch.ext.bits;
}

const initAction = function (state, _global, bits, api) {
    return new Action(state, _global, bits, api);
}

const fetchChannelParameter = function (_state) {
    // TODO fetch Channel ID in any way!
    _state.channelID = 43797122;
}

const initFabricCanvas = function (state, action) {
    // init canvas
    state.canvas = document.createElement('canvas');
    state.canvas.setAttribute('id', 'canvas')
    state.ctx = state.canvas.getContext('2d');

    // push canvas to body
    document.body.appendChild(state.canvas);
    // console.log(state.canvas)

    // design canvas weight and height
    state.vw = 1280;
    state.vh = 720;

    state.canvas.width = state.vw;
    state.canvas.height = state.vh;

    state.fcanvas = new fabric.Canvas('canvas');
    state.fctx = state.fcanvas.getContext('2d');
    state.fcanvas.on('selection:created', action.handleSelectItem);
}

const registerBitsAction = function (bits, action) {
    bits.onTransactionComplete(action.handleTransactionComplete);
    bits.onTransactionCancelled(action.handleonTransactionCancelled);
}

const initFirebase = function (state, firebaseConfig, action) {
    firebase.initializeApp(firebaseConfig);

    var channelNode = firebase.database().ref(`/bitsWalls/${state.channelID}/bricks`);
    channelNode.once('value').then(action.handleInitBricks);

    // mean update walls
    channelNode.on('child_changed', action.handleBrickChange);
}

