import { decode, hashFunction } from "@/lib/base64URL";

function verifyToken(token: string): false | object {
  const [info, hash] = decodeURIComponent(token).split(".");

  const computedHash = hashFunction(info, process.env.PRIVATE_KEY);
  if (computedHash !== hash) return false;

  try {
    const json = JSON.parse(decode(info));
    console.log(json)
    return json;
  } catch(e) {
    return false;
  }
}

export default async function Home({ params }) {
  const res = verifyToken((await params).token);

  if (!res)
    return <h1> Verification Failed! </h1>

  return (
    <div>
      <h1> Verification Successfull </h1>
      <p> Accredited to {res.name} </p>
      <p> {res.title} regarding {res.eventName} </p>
      <p> Generated at {new Date(res.date).toISOString()} </p>
    </div>
  )
}
