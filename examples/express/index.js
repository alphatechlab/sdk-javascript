require('dotenv').config();

const express = require('express');
const multer = require('multer');
const alphatech = require('../../index');

const app = express();

// Using buffer :
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Using filesystem :
// const upload = multer({ dest: "uploads" });

alphatech.setConfig({
  token: process.env.TOKEN,
  teamId: process.env.TEAM_ID,
});

app.get('/', function defaultRoute(req, res) {
  res.json('Hello World');
});

app.post('/upload', upload.single('file'), async function uploadRoute(req, res) {
  try {
    if (req.file) {
      const file = req.file.path || req.file.buffer;
      const response = await alphatech.upload(file, {
        path: `/uploaded/${req.file.originalname}`,
      });
      return res.json(response);
    }
    return res.status(400).json({ error: 'File is missing' });
  } catch (err) {
    // console.error({ err });
    return res.status(400).json({ error: 'An error occurred' });
  }
});

app.listen(process.env.PORT || 3100, function onListen() {
  console.log(`Server listening to port ${process.env.PORT}`);
});
