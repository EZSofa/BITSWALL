const bits = window.Twitch.ext.bits;
const _GLOBAL = {
  canvas: null,
  ctx: null,
  fctx: null,
  vw: null,
  vh: null,
  mode: null,

  bricks: [],
  fBricks: [],
  handlingBrick: null,
  channelId: 43797122,
  burst01 :new Image(),
  burst02 : new Image(),
  burst03 : new Image()
}
_GLOBAL.burst01.src = './imgs/burst001.png'
_GLOBAL.burst02.src = './imgs/burst002.png' 
_GLOBAL.burst03.src = './imgs/burst003.png'

console.log('global', _GLOBAL)


window.onload = function(){
  this.console.log("Hello Twitch Hackthon!!")

  // init canvas
  _GLOBAL.canvas = document.createElement('canvas');
  _GLOBAL.canvas.setAttribute('id', 'canvas')
  _GLOBAL.ctx = _GLOBAL.canvas.getContext('2d');
  
  // push canvas to body
  document.body.appendChild(_GLOBAL.canvas);
  // console.log(_GLOBAL.canvas)

  // design canvas weight and height
  _GLOBAL.vw = 1280;
  _GLOBAL.vh = 720;

  _GLOBAL.canvas.width = _GLOBAL.vw;
  _GLOBAL.canvas.height = _GLOBAL.vh;

  _GLOBAL.fcanvas = new fabric.Canvas('canvas');
  _GLOBAL.fctx = _GLOBAL.fcanvas.getContext('2d')
  _GLOBAL.fcanvas.on('selection:created', (info)=>{
    
    if(info.selected.length > 1){
      this.alert('Please select single brick')
      _GLOBAL.fcanvas.discardActiveObject();
      return
    }

    let target = info.target
    let brick = _GLOBAL.bricks[target.brickIndex]
    _GLOBAL.handlingBrick = brick
    console.log('brick = ', brick)
    bits.useBits(brick.type);
    _GLOBAL.fcanvas.discardActiveObject();
  })

  // fake()
}

const handleReflash = (bricks) =>{
  if(bricks.length < 1) return
  _GLOBAL.fBricks = []
  _GLOBAL.bricks = []
  _GLOBAL.fcanvas.clear()
  
  for(let i in bricks){
    let src = bricks[i]
    let brick = new Brick(src.id, src.x, src.y, src.sx, src.sy, src.angle,src.type, src.active, src.reward)
    _GLOBAL.bricks.push(brick)

    if(brick.active){
      let fObj = new fabric.Image(BRICK_INFO[brick.type].image,{
        left: brick.x,
        top: brick.y,
        scaleX: brick.sy,
        scaleY: brick.sx,
        angle: brick.angle
      })
  
      fObj.brickIndex = i
      _GLOBAL.fBricks.push(fObj)
      _GLOBAL.fcanvas.add(fObj);
    }

  }
}

const drawBurst = (bricks, brick) => {
  const random_number = Math.random()
  let img = null
  if(random_number > 0.5){
    img = _GLOBAL.burst01
  }
  else{
    img = _GLOBAL.burst02
  }

  // let img = _GLOBAL.burst03
  let speed = 80

  const boom = {
    x: brick.x +  ( (120 * brick.sx) - 96 ), // * Math.sin(brick.angle * Math.PI / 180),
    y: brick.y +  ( (70 * brick.sy)  - 96 ) //* Math.cos(brick.angle * Math.PI / 180)
  }

  for(let i = 0; i < 25; i++){
    setTimeout(()=>{
      _GLOBAL.fcanvas.renderAll()
      _GLOBAL.fctx.drawImage(
        img,
        i * 192,
        0,
        192,192,
        boom.x, boom.y,
        192,192
      )
      // _GLOBAL.fcanvas.clear()

      // _GLOBAL.fcanvas.renderAll()
    }, i * speed)
  }

  setTimeout(()=>{
    brick.active = false
    handleReflash(bricks)
  }, 15 * speed)

  setTimeout(()=>{
    _GLOBAL.fcanvas.renderAll()
  }, 25 * speed)
  
}