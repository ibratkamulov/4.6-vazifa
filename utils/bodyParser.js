const querystring = require('querystring');

// POST form ma'lumotlarini o'qish
function parseBody(req, callback) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    const parsedBody = querystring.parse(body);
    callback(parsedBody);
  });
  
  req.on('error', (error) => {
    console.error('Body parse xatosi:', error);
    callback({});
  });
}

module.exports = { parseBody };