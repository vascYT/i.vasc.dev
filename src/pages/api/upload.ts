import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import { s3 } from "@/lib/s3";
import { randomId, sendDiscordWebhook } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return;

  const form = formidable({});
  const [fields, files] = await form.parse(req);

  const password = fields["password"].toString();
  if (!password || password == process.env.PASSWORD) {
    res.status(400).json({ success: false, error: "Invalid password" });
    return;
  }

  const file = files.file[0];
  if (
    file.size === 0 ||
    !file.mimetype ||
    !file.mimetype.startsWith("image/") ||
    !file.originalFilename
  ) {
    res.status(400).json({ success: false, error: "Invalid file" });
    return;
  }

  const fileName = `${randomId(5)}.${file.mimetype.split("/").pop()}`;
  const fileData = await fs.readFile(file.filepath);

  const command = new PutObjectCommand({
    Body: fileData,
    Bucket: process.env.BUCKET_NAME || "",
    Key: `${process.env.BUCKET_KEY_PREFIX || ""}${fileName}`,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    await sendDiscordWebhook(fileName);
    res.status(200).json({ success: true, fileName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
}
