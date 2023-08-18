import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";
import { Image } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [buttonLabel, setButtonLabel] = useState<string>();
  const onDrop = useCallback(async (files: File[]) => {
    if (!files || files.length == 0) return;
    setButtonLabel("Uploading...");

    const formData = new FormData();
    formData.append("file", files[0]);

    const res = await fetch("/api/upload", {
      method: "post",
      body: formData,
    });
    location.href = `/${(await res.json()).fileName}`;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className="h-screen w-full flex items-center justify-center"
      {...getRootProps()}
    >
      <div className="shadow-2xl rounded-lg">
        <Button variant="outline" onClick={() => inputRef?.current.click()}>
          <Image className="mr-2 h-4 w-4" />{" "}
          {isDragActive ? "Drop to upload" : buttonLabel || "Select image"}
        </Button>
        <input {...getInputProps()} ref={inputRef}></input>
      </div>
    </div>
  );
}
