async function run() {
  const fs = await import('fs');
  const jwt = await import('jsonwebtoken'); // Need to use full path if not installed
  
  // Actually, I can just use the absolute path to jsonwebtoken
  const { sign } = require('jsonwebtoken');

  const token = sign(
    { id: "123", email: "admin@simplearn.com", role: "ADMIN" },
    ")hyn48dtC!C]q)<5!^r<iM_}{$6(>bVP,v=s?|cA<u+",
    { expiresIn: '1m' }
  );

  try {
    const res = await fetch('http://localhost:8001/api/admin/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "Student",
        email: "autotest1@simplearn.com"
      })
    });
    
    const text = await res.text();
    fs.writeFileSync('result.txt', `Status: ${res.status}\nBody: ${text}`);
    console.log("Done");
  } catch (err) {
    fs.writeFileSync('result.txt', `Error: ${err.message}`);
    console.error(err);
  }
}
run();
