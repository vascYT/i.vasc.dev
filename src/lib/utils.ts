import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomId(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function formatSize(bytes: number, si = false, dp = 1) {
  // https://stackoverflow.com/a/14919494/12282885
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export async function sendDiscordWebhook(fileName: string) {
  await axios({
    url: process.env.DISCORD_WEBHOOK_URL || "",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      embeds: [
        {
          title: "✨ New image uploaded",
          description: `${process.env.NEXT_PUBLIC_URL}/${fileName}`,
          image: {
            url: `${process.env.NEXT_PUBLIC_S3_URL}/${
              process.env.BUCKET_KEY_PREFIX || ""
            }${fileName}`,
          },
          color: 5763719, // Green https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
        },
      ],
    },
  });
}
