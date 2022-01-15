const http = require('http');
const handleRequests = require('./handle_requests');

require('dotenv').config()
const SERVER_PORT = process.env.PORT || 3010;

const server = http.createServer((req, res) => {
  handleRequests(req, res);
});

server.listen(SERVER_PORT);