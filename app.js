const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.status(200).json({ Hello: 'Hello from the server', ID: 56 });
});
app.post('/', (req, res) => {
  res.end('You can post to this endpoint');
});
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
