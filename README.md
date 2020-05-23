# alphatech

```js
const alphatech = require('alphatech');

alphatech.setConfig({
  token: process.env.TOKEN,
  teamId: process.env.TEAM_ID,
});

const response = await alphatech.upload(file, {
  path: `/uploaded/square_purple.png`,
});

console.log(response);

/*
{
  "filename": "square_purple_526umcy3fzd.png",
  "url": "https://cdn.alpha.tech/storage/5ec22662c3f9a300071f9b7b/uploaded/square_purple_526umcy3fzd.png",
  "teamId": "5ec22662c3f9a300071f9b7b",
  "userId": "5ec22662c3f9a300071f9b7c",
  "type": "image/png",
  "size": 22787,
  "metadata": {
    "width": 1134,
    "height": 1134
  },
  "createdAt": "2020-05-18T06:11:50.572Z",
  "_id": "5ec1a41b08e54d0007e5f3ea",
  "etag": "3fb621ea4d4d1260976b6937ae7f57d1"
}
*/
```
