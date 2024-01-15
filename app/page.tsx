"use client";

import { useState } from "react";
import Image from "next/image";
import Markdown from "react-markdown";

export default function Home() {

  const [file, setFile] = useState([]);
  const [prompt, setPrompt] = useState<string>("who is the person in the image?");
  const [showGenerate, setShowGenerate] = useState(false);

  function handleChange(e: any) {

    const length = e.target.files.length;

    for (let i = 0; i < length; i++) {
      let data = URL.createObjectURL(e.target.files[i]);
      // @ts-ignore
      setFile((prev) => [...prev, data]);
    }

    setShowGenerate(true);

  }

  const [output, setOutput] = useState<string>("");

  const fileToGenerativePart = async (file: any) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      // @ts-ignore
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const handleClick = async () => {
    const fileInputEl = document.querySelector("input[type=file]");
    const imageParts = await Promise.all(
      // @ts-ignore
      [...fileInputEl.files].map(fileToGenerativePart)
    );

    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt,
        imageParts: imageParts
      })
    });

    const data = await response.json();
    setOutput(data.text);
  }

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  }

  const onClickButton = () => {
    const fileInputEl = document.querySelector("input[type=file]");
    // @ts-ignore
    fileInputEl.click();
  }

  return (
    <main className="flex flex-col gap-5 justify-center items-center h-screen">
      <div className="flex items-center gap-3">
        <Image src="/image.png" alt="" width={50} height={50} />
        <h1 className="text-2xl font-bold">AI Image Recognition</h1>
      </div>
      <button onClick={onClickButton} className="w-40 h-10 bg-black text-white rounded-md font-medium mt-10 mb-5">Choose files</button>
      <input type="file" name="" id="" multiple onChange={handleChange} className="hidden" />
      {file.map((item, index) => {
        return (
          <div key={index} className="flex gap-2">
            <Image src={item} width={200} height={200} alt="" />
          </div>
        )
      })}
      {showGenerate && (
        <div className="flex flex-col justify-center items-center gap-5">
          <input type="text" className="border-black border-2 w-60 p-2 rounded-sm" placeholder="What's in the image?" onChange={handlePromptChange}/>
          <button onClick={handleClick} className="w-40 h-10 bg-black text-white rounded-md font-medium">Generate</button>
        </div>
      )}
      <Markdown className="w-80 h-40">
        {output}
      </Markdown>
    </main>
  )
}