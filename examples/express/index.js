require("dotenv").config();

const express = require("express");
const multer = require("multer");
const alphatech = require("../../index");

const app = express();

// Using buffer :
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Using filesystem :
// const upload = multer({ dest: "uploads" });

alphatech.configure({
  token: process.env.TOKEN,
  teamId: process.env.TEAM_ID,
});

app.get("/", function (req, res) {
  res.json("Hello World");
});

app.post("/upload", upload.single("file"), async function (req, res) {
  try {
    if (req.file) {
      const file = req.file.path || req.file.buffer;
      const response = await alphatech.storage.files.upload(file, {
        path: `/uploaded/${req.file.originalname}`,
        metadata: {
          userId: "123",
        },
      });
      return res.json(response);
    } else {
      return res.status(400).json({ error: "File is missing" });
    }
  } catch (err) {
    console.error({ err });
    return res.status(400).json({ error: "An error occurred" });
  }
});

app.listen(process.env.PORT || 3100, function () {
  console.log(`Server listening to port ${process.env.PORT}`);
});
