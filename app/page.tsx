"use client";

import { useState } from "react";

export default function Home() {

  const [file, setFile] = useState();
  function handleChange(e:any) {
      console.log(e.target.files);
      // @ts-ignore
      setFile(URL.createObjectURL(e.target.files[0]));
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

    // console.log(imageParts);
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

  return (
    <main>
      <input type="file" name="" id="" multiple onChange={handleChange}/>
      <img src={file} />
      <button onClick={handleClick}>Generate</button>
      <div>
        {output}
      </div>
    </main>
  )
}