const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const API_URL = 'http://127.0.0.1:5001';
const SECRET = 'your_jwt_secret_key_here_change_in_production';

async function testUploadQuestion() {
  const token = jwt.sign({ userId: 1 }, SECRET);
  
  const filePath = 'test_q.pdf';
  fs.writeFileSync(filePath, 'dummy question content');

  const form = new FormData();
  form.append('title', 'Test Question');
  form.append('course_id', '1'); 
  form.append('file', fs.createReadStream(filePath));

  console.log('\n--- Testing POST /api/study/questions/upload ---');
  const res = await fetch(`${API_URL}/api/study/questions/upload`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      ...form.getHeaders()
    },
    body: form
  });
  
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Data:', JSON.stringify(data, null, 2));

  fs.unlinkSync(filePath);
}

testUploadQuestion();
