'use strict'

const { Storage } = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env.CLOUD_BUCKET
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.KEYFILE_PATH
});
const bucket = storage.bucket(CLOUD_BUCKET);

const getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {

  if (!req.files) {
    return next()
  }

  let promises = [];
  req.files.forEach((image, index) => {
    const gcsname = Date.now() + image.originalname
    const file = bucket.file(gcsname)

    const promise = new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype
        }
      });

      stream.on('finish', async () => {
        try {
          req.files[index].cloudStorageObject = gcsname
          await file.makePublic()
          req.files[index].cloudStoragePublicUrl = getPublicUrl(gcsname)
          resolve();
        } catch (error) {
          reject(error)
        }
      });

      stream.on('error', (err) => {
        req.files[index].cloudStorageError = err
        reject(err)
      });

      stream.end(image.buffer);
    })

    promises.push(promise)
  });

  Promise.all(promises)
    .then(_ => {
      promises = [];
      next();
    })
    .catch(next);
}

module.exports = {
  sendUploadToGCS
}