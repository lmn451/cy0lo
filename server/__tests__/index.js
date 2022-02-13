import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

import { removeFileAfterTime } from "../helpers.js";

const MEMES_DIR = `C:\\Projects\\cyolo\\server\\memes`; // OS specific
jest.useFakeTimers();
jest.mock("fs");
//  I don't think it is a good idea to mock fs.rm() or fs.unlink() cause it is an implementation detail of
test("removeFileAfterTime helper removes file after time", () => {
  const fileName = `test.jpg`;
  const filePath = path.join(MEMES_DIR, fileName);
  fs.writeFileSync(`${MEMES_DIR}/${fileName}`, "test");
  expect(fs.existsSync(filePath)).toBe(true);
  const retentionTime = 1000;
  removeFileAfterTime(filePath, retentionTime);
  jest.advanceTimersByTime(retentionTime);
  expect(fs.existsSync(filePath)).toBe(false);
});
