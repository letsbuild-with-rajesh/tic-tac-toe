const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const sendResp = (res, status, data) => {
  res.writeHead(status);
  res.end(data);
}

const sendJsonResp = (res, status, data) => {
  const contentType = {'Content-Type': 'application/json'};

  res.writeHead(status, contentType);
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);

  let filePath = '.' + req.url;
  if (filePath == './') {
    filePath = './index.html';
  }
  filePath = '../client/build/' + filePath;
  filePath = path.join(__dirname, filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js'  : 'text/javascript',
    '.css' : 'text/css',
    '.json': 'application/json',
    '.png' : 'image/png',
    '.jpg' : 'image/jpg',
    '.gif' : 'image/gif',
    '.svg' : 'image/svg+xml',
    '.wav' : 'audio/wav',
    '.mp4' : 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf' : 'application/font-ttf',
    '.eot' : 'application/vnd.ms-fontobject',
    '.otf' : 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  if (urlObj.pathname === '/gamestate' && req.method === 'GET') {
    if (true) {
      sendJsonResp(res, 200, { "data": ["-", "-", "-", "-", "-", "-", "-", "-", "-"] });
    } else {
      sendJsonResp(res, 400, { "message": "Bad Request - Invalid inputs!" });
    }
  }


  fs.readFile(filePath, function(error, content) {
    if (error) {
      if(error.code == 'ENOENT') {
        fs.readFile('./404.html', function(error, content) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(filePath, 'utf-8');
        });
      } else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(2000);
