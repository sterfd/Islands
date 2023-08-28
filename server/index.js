const server = require('./api/server')

const HOST = 'localhost';
const PORT = 8888;

server.listen(PORT, () => console.log(`Server Running at ${HOST}:${PORT}.`)); // starts server 

