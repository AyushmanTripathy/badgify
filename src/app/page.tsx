"use client";

import { useState } from "react";
import { encode, hashFunction } from "@/lib/base64URL";
import { createDesignState, SelectDesign } from "./SelectDesign";

export default function Home() {
  const [background, setBackground] = useState("");
  const [name, setName] = useState("");
  const [designState, setDesignState] = useState(createDesignState("", ""));

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

    const newState = createDesignState(
      window.location.origin + "/" + token,
      name
    );
    const oldState = {...designState};
    oldState.name.value = name;
    oldState.qr.code = newState.qr.code;
    oldState.verifyURL = newState.verifyURL;
    setDesignState(oldState);
  }

  function reset() {
    setName("");
    setDesignState({ ...designState, verifyURL: "" });
  }

  if (designState.verifyURL)
    return (
      <>
        <button onClick={reset}> Reuse </button>
        <SelectDesign
          background={background}
          state={designState}
          setState={setDesignState}
        />
      </>
    );

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
        value={privateKey}
        required
      />
      <label> Name </label>
      <input
        type="text"
        placeholder="Jason Statham"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <label> Title </label>
      <input
        type="text"
        placeholder="Certificate of Appreciation"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        required
      />
      <label> Event Name </label>
      <input
        type="text"
        placeholder="Smash The Stone"
        onChange={(e) => setEventName(e.target.value)}
        value={eventName}
        required
      />

      {Boolean(background) || (
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setBackground(e.target.files[0])}
        />
      )}

      {Boolean(background) && <p> {background.name} </p>}

      <button type="submit"> Generate </button>
    </form>
  );
}
