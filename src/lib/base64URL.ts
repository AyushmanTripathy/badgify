import { sha256 } from "js-sha256";

export function encode(input: string) {
  const encoded = btoa(input);
  return encoded.replace(/\+/g, "-").replace(/\//g, "_");
}

export function decode(input: string) {
  return atob(input.replace(/-/g, "+").replace(/_/g, "/"));
}

export function hashFunction(input: string, key: string) {
  return encode(
    String.fromCharCode(
      ...new Uint8Array(sha256.arrayBuffer(input + "." + key))
    )
  );
}
