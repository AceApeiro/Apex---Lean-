const https = require('https');

https.get('https://i.imgur.com/LoyQTsc.jpg', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
});
