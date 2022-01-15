/* Index of server side requests */

const http = require('http');
require('dotenv').config()
const handleRequests = require('./handle_requests');

const SERVER_PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  handleRequests(req, res);
});

server.listen(SERVER_PORT);