import express from "express";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import fs from "fs";
import { promisify } from "util";
import {
  uploadFile,
  downloadFile,
  getDownloadUrl,
} from "../../middlewares/s3.js";
import UploadModel from "../../models/UploadModel.js";
const upload = multer({ dest: "uploads/" });
const unLinkFile = promisify(fs.unlink);

//get all uploaded files
router.get("/", async (req, res) => {
  let files = await UploadModel.find();
  return res.status(200).send(files);
});

//Upload File to S3
router.post("/upload", upload.array("Documents"), async (req, res) => {
  try {
    const file = req.files;
    console.log(file[0]);

    const result = await uploadFile(file[0]);
    console.log(result);

    const filename = file[0].originalname;

    let upload = new UploadModel({
      key: result.key ? result.key : result.Key,
      fileName: filename,
    });

    await unLinkFile(file[0].path);
    await upload.save();

    return res.status(200).json({ Msg: "Data Saved" });
  } catch (err) {
    console.log(err);
  }
});

//Download File From S3

router.get("/download/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    let file = await UploadModel.findOne({ key: fileId });

    const url = getDownloadUrl(file);

    return res.send(url);
  } catch (err) {
    console.error(err);
  }
});

export default router;
