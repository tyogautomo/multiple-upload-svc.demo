const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));