require("dotenv").config();
const express = require("express");
const axios = require("axios").default;

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => res.send(`
  <html>
    <head><title>Success!</title></head>
    <body>
      <h1>You did it!</h1>
      <img src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" alt="Cool kid doing thumbs up" />
    </body>
  </html>
`));

app.post("/github", (req, res) => {

  if (req.body.action !== "created") {
  return res.status(204).send(); 
}
  const username = req.body.sender.login;
  const repoName = req.body.repository.name;
  const content = ":wave: Hi I am " + username + " and I starred your repository " + repoName + " :rocket:";
  const avatarUrl = req.body.sender.avatar_url;
  axios
    .post(process.env.DISCORD_WEBHOOK_URL, {
      content: content,
      embeds: [
        {
          image: {
            url: avatarUrl,
          },
        },
      ],
    })
    .then((discordResponse) => {
      console.log("Success!");
      res.status(204).send();
    })
    .catch((err) => console.error(`Error sending to Discord: ${err}`));
});

app.use((error, req, res, next) => {
  res.status(500)
  res.send({error: error})
  console.error(error.stack)
  next(error)
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
