const http = require('http');
require('dotenv').config();

const BASE_URL = 'http://localhost:4000';

function request(path, method = 'GET', body = null, headers = {}) {
  const url = new URL(path, BASE_URL);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  try {
    const authHeaders = { Origin: 'http://localhost:8085' };
    console.log('=== Test 1: Login ===');
    const loginRes = await request('/api/v1/owner/auth/login', 'POST', {
      email: 'owner@test.com',
      password: 'password123',
    }, authHeaders);
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginRes.body, null, 2));

    if (loginRes.status !== 200 || loginRes.body.status !== 'success') {
      throw new Error('Login failed');
    }

    const token = loginRes.body.data.token;
    console.log('\n=== Test 2: Create Store ===');
    const storePayload = {
      store_name: 'yeasin',
      business_type: 'E-commerce',
      country: 'Bangladesh',
      shop_address: 'Awona, Sholla, Nawabgonj, Dhaka.',
      shop_email: 'testowner2@bizscal.com',
      shop_phone_number: '+8801834886669',
      shop_details: '',
      topbar_announcement: '',
    };
    const createRes = await request('/api/v1/owner/stores', 'POST', storePayload, {
      Authorization: `Bearer ${token}`,
      Origin: 'http://localhost:8085',
    });
    console.log('Status:', createRes.status);
    console.log('Response:', JSON.stringify(createRes.body, null, 2));

    if (createRes.status !== 201 || createRes.body.status !== 'success') {
      throw new Error('Create store failed');
    }

    const storeId = createRes.body.data.store_id;
    console.log('\n=== Test 3: Get Store Configuration ===');
    // Use query param to specify store_id since resolve_store may need it
    const configRes = await request(`/api/v1/owner/store-configuration?store_id=${storeId}`, 'GET', null, {
      Authorization: `Bearer ${token}`,
      Origin: 'http://localhost:8085',
    });
    console.log('Status:', configRes.status);
    console.log('Response:', JSON.stringify(configRes.body, null, 2));

    if (configRes.status !== 200 || configRes.body.status !== 'success') {
      throw new Error('Get store configuration failed');
    }

    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
  }
}

runTests();
