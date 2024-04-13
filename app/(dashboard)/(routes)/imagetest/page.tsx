"use client";
import { useState } from "react";

interface LottieFile {
  [key: string]: any;
}

const OptimizeLottie: React.FC = () => {
  const [file, setFile] = useState<LottieFile | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setFile(JSON.parse(e.target!.result as string));
    };
    if (event.target.files?.[0]) {
      reader.readAsText(event.target.files[0]);
    }
  };

  const handleOptimize = async () => {
    if (!file) return;

    const response = await fetch("/api/optimize-lottie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(file),
    });
    const optimizedJson: LottieFile = await response.json();
    downloadJSON(optimizedJson, "optimized-lottie.json");
  };

  const downloadJSON = (jsonObj: LottieFile, fileName: string) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(jsonObj));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".json" />
      <button onClick={handleOptimize} disabled={!file}>
        Optimize and Download
      </button>
    </div>
  );
};

export default OptimizeLottie;
