import sharp from "sharp";
import pngFileStream from "png-file-stream";
import GIFEncoder from "gifencoder";
import fs from "fs";

async function save_image(frame, width, height, folder, name) {
  image = sharp(frame, {
    raw: {
      width: width,
      height: height,
      channels: 3,
    },
  });
  await image.toFile(folder + name);
  return image;
}

async function create_gif(width, height, folder, name) {
  const encoder = new GIFEncoder(width, height);
  const image_names = folder + name + "*.png";
  const stream = pngFileStream(folder + name + "*.png")
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 500, quality: 10 }))
    .pipe(fs.createWriteStream(folder + name + ".gif"));

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

export default { save_image, create_gif };
