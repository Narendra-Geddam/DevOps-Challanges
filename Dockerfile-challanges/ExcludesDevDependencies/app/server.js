const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('<html><body><h1>Welcome to iximiuz Labs!</h1><p>A simple Express.js application.</p></body></html>\n');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'my-app',
    version: '1.0.0',
    node: process.version,
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

module.exports = app;
