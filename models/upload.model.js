import mongoose from "mongoose";

let uploadSchema = mongoose.Schema({
  key: {
    type: String,
  },
  fileName: {
    type: String,
  },
});

let UploadModel = new mongoose.model("Upload", uploadSchema);

export default UploadModel;
