import fs from "fs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const removeFileAfterTime = (path, retentionTime) => {
  setTimeout(
    () =>
      fs.rm(path, (err) => {
        if (err) console.warn(err);
      }),
    retentionTime
  );
};
