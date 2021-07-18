/* Index of server side requests */

const http = require('http');
const fs = require('fs');
const path = require('path');
const apiRequests = require('./api_requests');

const apisList = apiRequests.apisList;
const handleApiRequests = apiRequests.handleApiRequests;
const handleStaticRequests = require('./static_requests');

const SERVER_PORT = 2000;

const server = http.createServer((req, res) => {
  if (apisList.includes(req.url)) {
    handleApiRequests(req, res);
  } else {
    handleStaticRequests(req, res);
  }
});

server.listen(SERVER_PORT);
