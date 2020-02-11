if (!process.env.NODE_ENV || process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
  require('dotenv').config();
};

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { sendUploadToGCS } = require('./upload');

const app = express();
const PORT = 3000;
const Multer = multer({
  storage: multer.memoryStorage,
  limits: 1024 * 1024
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/upload', Multer.array('image'), sendUploadToGCS, (req, res, next) => {
  res.status(200).json({ status: 'success uploading files!' })
})

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));