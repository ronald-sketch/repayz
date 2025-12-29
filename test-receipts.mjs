import 'dotenv/config';

const EPORTAL_BASE_URL = 'https://eportal.envipco.com/api';
const EPORTAL_USERNAME = process.env.EPORTAL_USERNAME;
const EPORTAL_PASSWORD = process.env.EPORTAL_PASSWORD;
const MACHINE_ID = '090373';

async function main() {
  console.log('Authenticating with ePortal...');
  
  // Login and get session cookie
  const loginRes = await fetch(
    `${EPORTAL_BASE_URL}/login?username=${encodeURIComponent(EPORTAL_USERNAME)}&password=${encodeURIComponent(EPORTAL_PASSWORD)}`,
    { method: 'GET', headers: { 'Accept': 'application/json' }, redirect: 'manual' }
  );
  
  // Get session cookie
  const setCookie = loginRes.headers.get('set-cookie');
  let sessionCookie = '';
  if (setCookie && setCookie.includes('sessionid=')) {
    sessionCookie = setCookie.split(';')[0];
  }
  console.log('Session cookie:', sessionCookie);
  
  const loginData = await loginRes.json();
  const apiKey = loginData.ApiKey;
  console.log('✅ Logged in, API key:', apiKey.substring(0, 8) + '...');
  
  // Get receipts - use session cookie
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  console.log(`\nFetching receipts from ${yesterday} to ${today}...`);
  
  const receiptsRes = await fetch(
    `${EPORTAL_BASE_URL}/receipts?apiKey=${apiKey}&startDate=${yesterday}&endDate=${today}&rvms=${MACHINE_ID}`,
    { 
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      },
      redirect: 'manual'
    }
  );
  
  console.log('Response status:', receiptsRes.status);
  console.log('Content-Type:', receiptsRes.headers.get('content-type'));
  
  const receiptsData = await receiptsRes.text();
  console.log('\n=== RECEIPTS DATA ===');
  console.log(receiptsData.substring(0, 3000));
  
  // Parse CSV and show structure
  const lines = receiptsData.trim().split('\n');
  if (lines.length > 1 && !receiptsData.includes('Invalid')) {
    console.log('\n=== PARSED STRUCTURE ===');
    const headers = lines[0].split(',');
    console.log('Headers:', headers);
    console.log(`\nTotal records: ${lines.length - 1}`);
    console.log('\nLast 5 records:');
    for (let i = Math.max(1, lines.length - 5); i < lines.length; i++) {
      const values = lines[i].split(',');
      console.log(`\nRecord ${i}:`);
      headers.forEach((h, idx) => {
        if (values[idx]) console.log(`  ${h}: ${values[idx]}`);
      });
    }
  }
}

main().catch(console.error);
