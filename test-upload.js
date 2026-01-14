import 'dotenv/config';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const API_KEY = process.env.STORAGE_SERVER_API_KEY;

console.log('🧪 Starting Local Storage Server Test...');
console.log(`📡 URL: ${BASE_URL}`);

if (!API_KEY) {
  console.error('❌ Error: STORAGE_SERVER_API_KEY is missing in .env file');
  process.exit(1);
} else {
  console.log(`🔑 API Key found: ${API_KEY.slice(0, 5)}...`);
}

async function testUpload() {
  try {
    const filePath = path.join(__dirname, 'package.json'); // Use package.json as a dummy file
    if (!fs.existsSync(filePath)) {
      console.error('❌ Error: package.json not found to use as test file');
      return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('folder', 'test_uploads');

    console.log('📤 Uploading file...');
    const response = await axios.post(`${BASE_URL}/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('✅ Upload Success!');
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Upload Failed:', error.response.status, error.response.data);
    } else {
      console.error('❌ Upload Error:', error.message);
    }
  }
}

testUpload();
