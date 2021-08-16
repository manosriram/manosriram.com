---
id: 2
title: Securing JWTs using Redis and NodeJS
# image field is not mandatory
# you can skip it to keep the size of blog cards small
# image: https://manosriram.hashnode.dev/_next/image?url=https%3A%2F%2Fcdn.hashnode.com%2Fres%2Fhashnode%2Fimage%2Fupload%2Fv1615498579423%2FT4HPZ-59O.png%3Fw%3D1600%26h%3D840%26fit%3Dcrop%26crop%3Dentropy%26auto%3Dcompress%2Cformat%26format%3Dwebp&w=1920&q=75
createdAt: "2020-08-16 10:10:00"
tags:
  - authentication
  - nodejs
category: dev
author:
  name: manosriram
  image: /images/blog-author.png
---

We all know JWTs are vulnerable to attacks, there are many alternatives to it. But, we can improve our security mechanism by NOT storing the tokens in the browser.

### Technique
We can use a counter which is mapped to a specific token. When creating a cookie, the value of this counter is given instead of the token itself. This way, the token stays on the server.

As we can see this is kind of a key-value relationship, for this Redis is quite a good choice. Also, it is scalable.

![redis-mano6.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615500215971/PGD6zum-e.png)

### Initializing Redis variables
- We need to initialize redis variable say "counter" to 0 before starting.
- We'll be using this counter value to map tokens.

![mano-jwt-redis4.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615500086516/Ophoj1RS8.png)

### Creating a token
We can create a token using "jsonwebtoken" package in Nodejs, but before that, we need a user. To keep things simple, we can create a *fakeUser* object.


```
const fakeUser = {
    name: "John",
    email: "john@mail.com",
    password: "pass1234"
};
``` 

1. We need to increment the counter, so that we don't have any collisions.
2. After incrementing, we can create a token using *jwt.sign(...)*.
3. Now, we can set the **key as the counter and the value as the token**.

```
client.get("counter", (err, data) => {
        client.set("counter", parseInt(data) + 1);
        jwt.sign(fakeUser, "secret", { expiresIn: "1d" }, (err, token) => {
            client.set(parseInt(data) + 1, token);
            res.cookie("jwt-id", parseInt(data) + 1);
            return res.send("logged in");
        });
});
```

We do *parseInt(data)* as Redis stores variables in the form of strings. We need an integer to increment which is why we need to parse it into an integer.

If this piece of code executes successfully, the output looks like this in redis-cli.

![mano-jwt-redis3.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615500104214/MrmWYRN_-.png)


### Verifying token and parsing token payload.

What is left is that we need to verify if this works. That'll be a POST request which means that the browser will send us the counter (id in this case).

- We need to get the token stored in the counter coming from the browser.
- Verify the token is valid using *jwt.verify(...)*
- The payload will be returning as a callback!

```
const { id } = req.body;
client.get(id, (err, data) => {
    jwt.verify(data, "secret", async (err, payload) => {
        console.log(payload);
    });
});
```
![mano-jwt-redis2.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615500113136/GGMEGevmN.png)

And, you can verify the *jwt-id* cookie in the browser itself.

![mano-jwt-redis1.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1615500129017/oYZUj5GGb.png)

Thanks for reading.

[Video Link](https://www.youtube.com/watch?v=HxH_zJTEsZM)


[Mano Sriram](https://www.manosriram.com/)

