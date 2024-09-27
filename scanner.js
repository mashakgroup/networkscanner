const http = require('http');

// Common patterns that may indicate malicious activity (like SQL injection, XSS, etc.)
const maliciousPatterns = [
  /<script>/i,               // XSS (Cross-site scripting)
  /select .* from/i,          // SQL Injection (Basic)
  /union .* select/i,         // SQL Injection (Advanced)
  /' or 1=1--/i,              // SQL Injection Bypass Login
  /eval\(/i,                  // JavaScript eval (potentially dangerous)
  /<iframe>/i,                // iframe injection
  /<img src=/i,               // Image injection
];

// Function to check if request data is suspicious
function detectMaliciousActivity(data) {
  for (let pattern of maliciousPatterns) {
    if (pattern.test(data)) {
      console.log(`⚠️ Potential Malicious Activity Detected: ${data}`);
      return true;
    }
  }
  return false;
}

// Create a simple HTTP server to simulate monitoring network traffic
const server = http.createServer((req, res) => {
  let requestBody = '';

  // Capture the request data
  req.on('data', (chunk) => {
    requestBody += chunk.toString();
  });

  // Analyze the request after it's received
  req.on('end', () => {
    console.log(`Incoming request from ${req.connection.remoteAddress}`);

    // Check request headers for suspicious patterns
    Object.entries(req.headers).forEach(([header, value]) => {
      detectMaliciousActivity(value);
    });

    // Check request body for suspicious patterns
    if (requestBody) {
      detectMaliciousActivity(requestBody);
    }

    // Respond to the request
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Network monitored successfully\n');
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Monitoring network traffic for malicious activity...`);
});
