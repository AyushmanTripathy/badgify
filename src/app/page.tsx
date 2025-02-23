"use client";

import { useState } from "react";
import { encode, hashFunction } from "@/lib/base64URL";
import { SelectDesign } from "./SelectDesign";

function InputEventData({ setFile, name, setName, setVerifyURL }) {
  const [privateKey, setPrivateKey] = useState("");
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");

  function generateVerifyURL() {
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

  return (
    <form
      onSubmit={generateVerifyURL}
      className="h-screen min-w-[60vw] flex flex-col"
    >
      <h1> Certificate generator </h1>
      <label> Private Key </label>
      <input
        className="border border-black"
        onChange={(e) => setPrivateKey(e.target.value)}
        required
      />
      <label> Name </label>
      <input
        type="text"
        placeholder="Jason Statham"
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label> Title </label>
      <input
        type="text"
        placeholder="Certificate of Appreciation"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label> Event Name </label>
      <input
        type="text"
        placeholder="Smash The Stone"
        onChange={(e) => setEventName(e.target.value)}
        required
      />

      <input type="file" accept="image/*" required onChange={e => setFile(e.target.files[0])}/>

      <button type="submit"> Generate </button>
    </form>
  );
}

export default function Home() {
  const [verifyURL, setVerifyURL] = useState("");
  const [background, setBackground] = useState("");
  const [name, setName] = useState("");

  if (verifyURL) return <SelectDesign background={background} verifyURL={verifyURL} name={name} />;

  return <InputEventData name={name} setVerifyURL={setVerifyURL} setFile={setBackground} setName={setName} />;
}
