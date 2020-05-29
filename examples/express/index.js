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

app.post('/pdf/create', async function pdfCreateRoute(req, res) {
  try {
    const path = req.body.path || '/pdf/';
    const response = await alphatech.pdf.create(helloTpl({ name: 'John' }), { path });
    return res.json(response);
  } catch (err) {
    console.error({ err });
    return res.status(400).json({ error: err.message });
  }
});

app.post('/file/upload', upload.single('file'), async function fileUploadRoute(req, res) {
  try {
    if (req.file) {
      const file = req.file.path || req.file.buffer;
      const path = req.body.path || `/uploaded/${req.file.originalname}`;
      const response = await alphatech.file.upload(file, { path });
      return res.json(response);
    }
    return res.status(400).json({ error: 'File is missing' });
  } catch (err) {
    console.error({ err });
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/file/remove/:id', async function fileRemoveRoute(req, res) {
  try {
    if (req.params.id) {
      const _id = req.params.id;
      const response = await alphatech.file.remove(_id);
      return res.json(response);
    }
    return res.status(400).json({ error: 'File id is missing' });
  } catch (err) {
    console.error({ err });
    return res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3100, function onListen() {
  console.log(`Server listening to port ${process.env.PORT}`);
});
