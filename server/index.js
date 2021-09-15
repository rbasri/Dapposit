const express = require('express');
const app = express();
const port = process.env.PORT || 3022;
const path = require('path');

app.use(express.static('./app/dist'));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../app/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Up on ${port}!`);
});