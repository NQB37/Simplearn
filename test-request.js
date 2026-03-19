async function run() {
  const fs = await import('fs');
  try {
    const res = await fetch('http://localhost:8001/api/admin/users', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
