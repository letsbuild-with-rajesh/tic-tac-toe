/* Handle requests for APIs */

const apisList = [ /* '/gamestate' */ ];

const handleApiRequests = (req, res) => {
 /* if (req.url === '/gamestate' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ "data": ["-", "-", "-", "-", "-", "-", "-", "-", "-"] }, null, 2));
  }
 */
};

module.exports = {
  apisList: apisList,
  handleApiRequests: handleApiRequests
};
