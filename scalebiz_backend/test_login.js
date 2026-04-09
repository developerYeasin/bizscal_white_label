const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/owner/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const data = JSON.stringify({
  email: 'user.basic1@example.com',
  password: 'password123',
});

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseBody);
      console.log('Response:', parsed);
    } catch (e) {
      console.log('Raw Response:', responseBody);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.write(data);
req.end();