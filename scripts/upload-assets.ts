import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const PUBLIC_DIR = "dist/client";

const files = fs
  .readdirSync(path.join(process.cwd(), PUBLIC_DIR, "images"), {
    recursive: true,
  })
  .map((file) => file as string)
  .filter((file) =>
    [".webp", ".avif", ".ico", ".png", ".jpeg"].some((ext) =>
      file.endsWith(ext),
    ),
  )
  .map((file) =>
    path.join(process.cwd(), PUBLIC_DIR, "images", file as string),
  );

if (!files.length) throw new Error("Files not found");

cloudinary.config({
  api_key: process.env.CD_API_KEY,
  api_secret: process.env.CD_API_SECRET,
  cloud_name: process.env.CD_CLOUD_NAME,
});

await Promise.all(
  files.map(async (file) => {
    console.info(`Uploading ${file}`);

    const filePaths = file.split("/").filter(Boolean);
    const imagesIndex = filePaths.indexOf("images");
    const parsedPath = path.parse(filePaths.slice(imagesIndex + 1).join("/"));
    const publicId = path.join(parsedPath.dir, parsedPath.name);

    try {
      const data = await cloudinary.uploader.upload(file, {
        public_id: publicId,
      });

      console.info(`File ${file} upload successfully with ${publicId} id`);

      return data;
    } catch (error) {
      console.error(`File ${file} failed to upload.`, error);

      throw error;
    }
  }),
).then((res) => res.filter((file): file is UploadApiResponse => !!file));
