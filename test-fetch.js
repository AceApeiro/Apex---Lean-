import http from 'http';

http.get('http://localhost:3000/api/minutes', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data.substring(0, 200));
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
