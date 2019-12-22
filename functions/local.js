const { server } = require('./server');
const port = 4000;

server.listen(port, ()=>{
    console.log(`BitWalls server is run on your local-${port}`)
});