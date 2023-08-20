import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { s3 } from "@/lib/s3";
import { formatSize } from "@/lib/utils";
import moment from "moment";
import path from "path";
import { CalendarDays, HardDrive } from "lucide-react";
import { ListObjectsV2Command, type _Object } from "@aws-sdk/client-s3";

interface props {
  fileObject: _Object;
}
export default function FileViewer({ fileObject }: props) {
  return (
    <>
      <Head>
        <title>{path.basename(fileObject.Key || "")}</title>
        <>
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_S3_URL}/${fileObject.Key}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      </Head>
      <div className="h-screen w-full flex items-center justify-center">
        <div className="shadow-2xl rounded-lg bg-gray-900 p-5 min-w-[500px]">
          <img
            src={`${process.env.NEXT_PUBLIC_S3_URL}/${fileObject.Key}`}
            alt="Uploaded image"
            className="rounded-md w-full"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center justify-center space-x-2">
              <CalendarDays className="w-5 h-5 stroke-white" />
              <p>
                {moment
                  .utc(fileObject.LastModified || "")
                  .format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <HardDrive className="w-5 h-5 stroke-white" />
              <p>{formatSize(fileObject.Size || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { fileName } = context.query;

  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME || "",
    Prefix: `${process.env.BUCKET_KEY_PREFIX || ""}${fileName as string}`,
    MaxKeys: 1,
  });
  const objects = await s3.send(command);

  if (!objects || !objects.Contents || objects.Contents.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      fileObject: JSON.parse(JSON.stringify(objects.Contents[0])),
    },
  };
}
