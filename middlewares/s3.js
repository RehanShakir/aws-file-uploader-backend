import dotenv from "dotenv";
dotenv.config();

import S3 from "aws-sdk/clients/s3.js";
import AWS from "aws-sdk";
import fs from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
// console.log(secretAccessKey);

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});
// console.log(s3);

export function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  console.log("Uplaod");

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename + "-" + file.originalname,
  };
  return s3.upload(uploadParams).promise();
}

export function downloadFile(res, file) {
  const options = {
    Bucket: bucketName,
    Key: file.key,
  };

  res.attachment(file.fileName);
  const fileObject = s3.getObject(options).createReadStream();
  fileObject.pipe(res);
}

export function getDownloadUrl(file) {
  const options = {
    Bucket: bucketName,
    Key: file.key,
    Expires: 3600,
  };

  const url = s3.getSignedUrl("getObject", options);
  return url;
}

export function getFileStream(fileKey, res) {
  console.log("Trying to download file", fileKey);

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });
  var s3 = new AWS.S3();
  var options = {
    Bucket: "/bucket-url",
    Key: fileKey,
  };

  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
}
