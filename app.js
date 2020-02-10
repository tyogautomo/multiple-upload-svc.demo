const express = require('express');
const cors = require('cors');
const multer = require('multer');

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

app.post('/upload', Multer.array('image'), (req, res, next) => {
  res.status(200).json({status: 'success uploading files!'})
})

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));