let socket = io.connect('https://twi.eztable.com');
// let socket = io.connect('http://127.0.0.1:3000');

socket.on('connect', () => {
    console.log('connect');
    socket.emit('register', 43797122);
});

socket.on('updateWall', (bricks = [], brickId) => {
    console.log(bricks)
    if(brickId){
        let deleteBrick
        for(let i in bricks){
            let brick = bricks[i]
            if(brick.id === brickId){
                brick.active = true
                deleteBrick = bricks[i]
                break;
            }
        }

        handleReflash(bricks)
        drawBurst(bricks, deleteBrick)
        // handle for burst!!
    }else{
        handleReflash(bricks)
    }

    
});

function breakBrick(brickId,channelId) {
    socket.emit('breakBrick', channelId, brickId);
}