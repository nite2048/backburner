import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const UPLOAD_DIR = path.join(dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
     fs.mkdirSync(UPLOAD_DIR, { recursive: true });
     console.log(`Created directory ${UPLOAD_DIR}`);
}

export function saveBase64Image(filename, data) {
     if (!filename || !data) throw new Error("Missing filename or data");

     const match = data.match(/^data:(.+);base64,(.+)$/);
     if (!match) throw new Error("Invalid base64 data");

     const mime = match[1];
     const base64 = match[2];
     const buffer = Buffer.from(base64, "base64");
     const filePath = path.join(UPLOAD_DIR, filename);

     fs.writeFileSync(filePath, buffer);

     return { filename, path: filePath, size: buffer.length, mime };
}

export function saveBase64String(filename, data) {
     if (!filename || !data) throw new Error("Missing filename or data");

     const match = data.match(/^data:(.+);base64,(.+)$/);
     if (!match) throw new Error("Invalid base64 data");

     // const mime = match[1];
     const base64 = match[2];

     return {filename : filename, base64 : base64};
}

export function listFiles() {
     return fs.readdirSync(UPLOAD_DIR);
}

export function getFilePath(name) {
     const safe = path.basename(name);
     const filePath = path.join(UPLOAD_DIR, safe);

     if (!fs.existsSync(filePath)) {
          throw new Error("File not found");
     }

     return filePath;
}

export function deleteFile(filePath) {
     try {
          fs.unlinkSync(filePath);
     } catch (error) {
          throw new Error(`Error deleting file: ${error.message}`);
     }
}

export function getMostRecentFile() {
     const files = fs.readdirSync(UPLOAD_DIR);
     if (files.length === 0) return null;

     const sorted = files
       .map(file => ({
         name: file,
         time: fs.statSync(path.join(UPLOAD_DIR, file)).mtime.getTime()
       }))
       .sort((a, b) => b.time - a.time);

     return path.join(UPLOAD_DIR, sorted[0].name);
}

export { UPLOAD_DIR };
