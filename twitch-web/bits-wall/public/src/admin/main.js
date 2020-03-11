const _config = {
  domain: 'https://us-central1-bitswall-8478f.cloudfunctions.net/bitsWalls',
}

let
  _state,
  _global,
  _api,
  _action,
  _twitch
  ;

$(document).ready(() => {


  // register button event
  _state = initState()

  _global = initGlobal()

  _api = initAPI(_config.domain)

  _action = initAction(_state, _global, _api, _twitch)

  _twitch = initTwitch()
  
  initFabricCanvas(_state, _action)

  registerTwitchAction(_twitch, _action)

  registerKeyboardAction(_action)

  registerDOMAction(_action)
})

const initState = () => {
  return new State()
}

const initGlobal = () =>{
  return new Global()
}

const initAPI = (domainUrl) => {
  return new API(domainUrl)
}

const initAction = (state, global, api, twitch) => {
  return new Action(state, global, api, twitch)
}

const initTwitch = () => {
  return window.Twitch.ext;
}

const initFabricCanvas = (state, action) => {
  state.canvas = document.getElementById('canvas');
  state.vh = 1280;
  state.vw = 1980;
  state.canvas.width = state.vw;
  state.canvas.height = state.vh;
  state.ctx = state.canvas.getContext('2d');

  state.fcanvas = new fabric.Canvas('canvas');
  state.fctx = state.fcanvas.getContext('2d');
  state.fcanvas.on('selection:created', console.log('hi'));
}

const registerTwitchAction = (twitch, action) =>{
  twitch.onContext(action.handleTwitchContext)
  twitch.onAuthorized(action.handleTwitchAuthorized)
  twitch.configuration.onChanged(action.handleTwitchConfigChange)
}

const registerKeyboardAction = (action) => {

  window.onkeydown = function (e) {
    if (e.keyCode === 16) {
      move = 2
    }
    if (e.keyCode === 8 || e.keyCode === 46) {
      if (fcanvas) {
        let activeGroup = fcanvas.getActiveObjects()

        if (activeGroup) {
          for (let i in activeGroup) {
            let obj = activeGroup[i]
            fcanvas.remove(obj)
          }
          fcanvas.discardActiveObject()
        }
      }
    }
    // up
    else if (e.keyCode === 38) {
      let activeGroup = fcanvas.getActiveObjects()
      if (activeGroup) {
        for (let i in activeGroup) {
          let obj = activeGroup[i]
          obj.set('top', obj.top - move)
        }
        fcanvas.renderAll()
      }
    }
    //down
    else if (e.keyCode === 40) {
      let activeGroup = fcanvas.getActiveObjects()
      if (activeGroup) {
        for (let i in activeGroup) {
          let obj = activeGroup[i]
          obj.set('top', obj.top + move)
        }
        fcanvas.renderAll()
      }
    }

    else if (e.keyCode === 37) {
      let activeGroup = fcanvas.getActiveObjects()
      if (activeGroup) {
        for (let i in activeGroup) {
          let obj = activeGroup[i]
          obj.set('left', obj.left - move)
        }
        fcanvas.renderAll()
      }
    }

    else if (e.keyCode === 39) {
      let activeGroup = fcanvas.getActiveObjects()
      if (activeGroup) {
        for (let i in activeGroup) {
          let obj = activeGroup[i]
          obj.set('left', obj.left + move)
        }
        fcanvas.renderAll()
      }
    }
  }

  window.onkeyup = function (e) {
    if (e.keyCode === 16) {
      move = 10
    }
  }
}

const registerDOMAction = (action) => {
  document.getElementById("file").addEventListener("change", function () {
    action.handleUploadImage();
  })
  document.getElementById("bit1").addEventListener("click", function () {
    action.addBit('TRIANGLE');
  })
  document.getElementById("bit100").addEventListener("click", function () {
    action.addBit('RECTANGLE');
  })
  document.getElementById("bit1000").addEventListener("click", function () {
    action.addBit('PENTAGON');
  })
  document.getElementById("bit5000").addEventListener("click", function () {
    action.addBit('DIMOND');
  })
  document.getElementById("bit10000").addEventListener("click", function () {
    action.addBit('STAR');
  })
  document.getElementById("save").addEventListener("click", function () {
    action.saveBrickSetting();
  })
  document.getElementById("launch").addEventListener("click", function () {
    action.launchBrickSetting();
  })
}