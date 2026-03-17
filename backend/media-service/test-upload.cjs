require('dotenv').config();
const jwt = require('jsonwebtoken');
const http = require('http');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
const token = jwt.sign({ id: 'test123', role: 'instructor' }, JWT_SECRET, { expiresIn: '1h' });

// Minimal 1x1 PNG
const pngBytes = Buffer.from(
  '89504e470d0a1a0a0000000d494844520000000100000001' +
  '08060000001f15c4890000000a49444154789c6260000000' +
  '020001e221bc330000000049454e44ae426082', 'hex'
);

function testEndpoint(path, fieldName, fileBytes, mimeType, filename) {
  return new Promise((resolve) => {
    const boundary = 'TestBoundary123456';
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`),
      fileBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    const options = {
      hostname: 'localhost', port: 8004, path, method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'Origin': 'http://localhost:3000'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data.substring(0, 400) }));
    });
    req.on('error', e => resolve({ status: 'ERR', body: e.message }));
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('JWT_SECRET loaded (first 5):', JWT_SECRET?.substring(0, 5));

  const pdfBytes = Buffer.from('%PDF-1.4\n1 0 obj\n<< >>\nendobj\n%%EOF\n');

  console.log('\n--- Image upload ---');
  const img = await testEndpoint('/api/media/images/upload', 'image', pngBytes, 'image/png', 'test.png');
  console.log('Status:', img.status);
  console.log('Body:', img.body);

  console.log('\n--- Document upload ---');
  const doc = await testEndpoint('/api/media/documents/upload', 'document', pdfBytes, 'application/pdf', 'test.pdf');
  console.log('Status:', doc.status);
  console.log('Body:', doc.body);
}

main().catch(console.error);
