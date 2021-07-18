/* Handle requests for static resources */

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const baseURL = 'http://' + req.headers.host + '/';
  const urlObj = new URL(req.url, baseURL);

  let filePath = req.url;
  if (filePath == '/') {
    filePath = '/index.html';
  }

  let MALICIOUS_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/;  // '../'
  if (MALICIOUS_REGEX.test(filePath)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end("Request forbidden!", 'utf-8');
  }

  filePath = '../client/build/' + filePath;
  filePath = path.join(__dirname, filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Page not found!', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Something went wrong, please contact site administrator', 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}
