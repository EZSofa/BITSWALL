class Action {
    constructor(state, global, bits, api) {
        this.state = state
        this.bits = bits
        this.api = api
        this.global = global

        this.handleSelectItem = this.handleSelectItem.bind(this)
        this.handleBrickChange = this.handleBrickChange.bind(this)
        this.handleInitBricks = this.handleInitBricks.bind(this)
        this.handleTransactionComplete = this.handleTransactionComplete.bind(this)
        this._reflash = this._reflash.bind(this)
    }

    handleSelectItem(info) {
        if (info.selected.length > 1) {
            this.alert('Please select single brick')
            this.state.fcanvas.discardActiveObject();
            return
        }

        let target = info.target
        let brick = this.state.bricks[target.brickIndex]
        this.state.handlingBrick = brick
        console.log('brick = ', brick)

        this.bits.useBits(brick.type);
        this.state.fcanvas.discardActiveObject();
    }

    // TODO compare the old state and draw brust animate
    handleBrickChange(data) {
        console.log('child change');
        console.log(data.key);
        console.log(data.val());

        // TODO
        // 1. find the changed before old state and coming data
        // 2. burst the different
        let brick = data.val()
        if(brick.active === false){
            this._drawBurst(brick)
        }
        else{
            let foundBrick = this.state.bricks.find((b)=>{
                return b.id === brick.id
            })
            
            if(foundBrick){
                foundBrick.active = true
                this._reflash(this.state.bricks)
            }
        }
    }

    handleInitBricks(snapshot) {
        let bricks = snapshot.val()
        console.log('get init data');
        console.log(bricks);
        if (bricks) {
            this.state.bricks = bricks.map((b)=>{
                return new Brick(b.id, b.x, b.y, b.sx, b.sy, b.angle, b.type, b.active, b.reward)
            })
            this._reflash();
        }
    }

    // TODO write the API to update firebase node
    handleTransactionComplete(o) {
        const productType = o.product.sku;

        if (state.handlingBrick) {
            this.api.breakBrick(this.state.handlingBrick.id, this.state.channelID);
            action.breakBrick(state.handlingBrick.id, state.channelID);
        }

    }

    handleonTransactionCancelled(o){
        console.log(`Transaction ${JSON.stringify(o)} cancel`);
        console.log(o);
    }

    _reflash() {
        if (this.state.bricks.length < 1) return
        this.state.fBricks = []
        this.state.fcanvas.clear()

        for (let i in this.state.bricks) {
            let brick = this.state.bricks[i]

            if (brick.active) {
                let fObj = new fabric.Image(this.global.brick_info[brick.type].image, {
                    left: brick.x,
                    top: brick.y,
                    scaleX: brick.sy,
                    scaleY: brick.sx,
                    angle: brick.angle
                })

                fObj.brickIndex = i
                this.state.fBricks.push(fObj)
                this.state.fcanvas.add(fObj);
            }
        }
    }

    _drawBurst(brick){
        console.log('draw burst')
        const random_number = Math.random()
        let img = null
        if (random_number > 0.5) {
            img = this.global.images.burst01
        }
        else {
            img = this.global.images.burst02
        }

        // let img = this.global.burst03
        let speed = 80

        const boom = {
            x: brick.x + ((120 * brick.sx) - 96), // * Math.sin(brick.angle * Math.PI / 180),
            y: brick.y + ((70 * brick.sy) - 96) //* Math.cos(brick.angle * Math.PI / 180)
        }

        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                this.state.fcanvas.renderAll()
                this.state.fctx.drawImage(
                    img,
                    i * 192,
                    0,
                    192, 192,
                    boom.x, boom.y,
                    192, 192
                )
                // this.state.fcanvas.clear()

                // this.state.fcanvas.renderAll()
            }, i * speed)
        }

        setTimeout(() => {
            let foundBrick = this.state.bricks.find((b)=>{
                return b.id === brick.id
            })

            if(foundBrick){
                foundBrick.active = false
            }

            this._reflash(this.state.bricks)
        }, 15 * speed)

        setTimeout(() => {
            this.state.fcanvas.renderAll()
        }, 25 * speed)

    }
}