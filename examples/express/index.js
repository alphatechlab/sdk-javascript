require('dotenv').config();

const express = require('express');
const multer = require('multer');
const alphatech = require('../..');

const helloTpl = require('./pdf-templates/hello');

const app = express();
app.use(express.json());

// Using buffer :
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Using filesystem :
// const upload = multer({ dest: 'uploads' });

alphatech.setConfig({
  token: process.env.TOKEN,
  teamId: process.env.TEAM_ID,
});

app.get('/', function defaultRoute(req, res) {
  res.json('Hello World');
});

app.post('/make-pdf', async function makePdfRoute(req, res) {
  try {
    const response = await alphatech.makePdf(helloTpl({ name: 'John' }), {
      path: `/pdf/hello-world.pdf`,
    });

    return res.json(response);
  } catch (err) {
    console.error({ err });
    return res.status(400).json({ error: err.message });
  }
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
    console.error({ err });
    return res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3100, function onListen() {
  console.log(`Server listening to port ${process.env.PORT}`);
});
