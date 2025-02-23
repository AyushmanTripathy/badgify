"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { encode, hashFunction } from "@/lib/base64URL";
import qr from "qr.js";

function QRCode({ value, name }) {
  const canvas: RefObject<HTMLCanvasElement | null> = useRef(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";

    const code = qr(value).modules;
    const size = 2;
    let z = canvas.current?.height - size * code.length - 10,
      x = 10;
    for (const row of code) {
      let y = z;
      for (const col of row) {
        if (col) ctx.fillRect(x, y, size, size);
        y += size;
      }
      x += size;
    }
    ctx.font = "50px Arial";
    ctx.fillText(name, 100, 100);
  }, []);


  function downloadCanvas() {
    const a = document.createElement("a");
    a.download = "certificate.jpg";
    a.href = String(canvas.current?.toDataURL("image/jpg"));
    a.click();
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <button onClick={downloadCanvas}> Download </button>
      <canvas
        className="border border-black"
        ref={canvas}
        height={720}
        width={1080}
      ></canvas>
    </div>
  );
}

export default function Home() {
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");
  const [verifyURL, setVerifyURL] = useState("");

  function generateQRCode() {
    const jsonInput = JSON.stringify({
      name,
      title,
      eventName,
      date: Date.now(),
    });
    const info = encode(jsonInput);
    const hash = hashFunction(info, privateKey);
    const token = info + "." + hash;
    setVerifyURL(window.location.origin + "/" + token);
  }

  if (verifyURL) return <QRCode value={verifyURL} name={name} />;

  return (
    <>
      <h1> Certificate generator </h1>
      <input
        className="border border-black"
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="EventName"
        onChange={(e) => setEventName(e.target.value)}
      />

      <button onClick={generateQRCode}> Generate </button>
    </>
  );
}
