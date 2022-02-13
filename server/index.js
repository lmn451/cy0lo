import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { removeFileAfterTime } from "./helpers.js";

dotenv.config();

const PORT = process.env.PORT;
const MEMES_DIR = process.env.MEMES_DIR;

const app = express();

app.use(cors());

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, MEMES_DIR);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "--" + file.originalname;
    req["fileName"] = fileName;
    cb(null, fileName);
  },
});

const upload = multer({ storage: fileStorageEngine });

app.put("/v1/file", upload.any("memes"), function (req, res, next) {
  const retentiontime = req.headers["retentiontime"] || 1000 * 60;
  removeFileAfterTime(path.join(MEMES_DIR, req.fileName), retentiontime);
  res.send({ link: `http://localhost:${PORT}/v1/${req.fileName}` });
});

app.get("/v1/:fileUrl", (req, res, next) => {
  const { fileUrl } = req.params;
  try {
    const fileBuffer = fs.readFileSync(path.join(MEMES_DIR, fileUrl));
    res.send(fileBuffer);
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
