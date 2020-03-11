const Brick = require("./src/brick");

let storage = {};

class BrickSetting {
    constructor(background, bricks) {
        // this.background = "";
        this.bricks = [];
    }
}

class Mario {
    constructor(userId, channelId) {
        this._userId = userId;
        this._channelId = channelId;
        this._setting = this._getBrickSetting();
    }
    getSetting() {
        return this._setting;
    }
    createSetting(id, setting) {
        
    }
    updateSetting() {

    }
    deleteSetting() {

    }
    setImg(img) {

    }
    getStates() {

    }
    getState(brickID) {
    }
    updateStates(bricks) {
        for (let brickID in bricks) {
            this.bricks[brickID].active = false;
        }
    }
    updateState(brickID) {
        this.bricks[brickID].active = false;
    }
    _getBrickSetting() {
        if (!(this._channelId in storage)) {
            storage[this._channelId ] = new BrickSetting();
        }
        return storage[this._channelId ];
    }
  
}