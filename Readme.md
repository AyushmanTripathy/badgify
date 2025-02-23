# Goal

1. Should be able to generate certificates
1. Certicates should have QR Code to verify them

# QR Code Generation

1. We take the information to be certified

```
{
    name: "Ayushman Tripathy",
    eventName: "Writing Bad Docs",
    message: "Certificate of Appreciation, First prize"
}
```

2. Encode this in base64

```
info = base64(json_info)
```

3. Hash the info along with a private key

```
hash = SHA256( info + private_key )
```

4. final output token will be

```
token = info + "." + hash
```

5. QR Code will stored the url

```
example.com/verify/token
```

# QR Code verification

1. recompute the hash, from info and private_key
1. check if computed hash matches the provieded hash
1. render page according
