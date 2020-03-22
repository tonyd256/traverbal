const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const Auth0 = require("auth0");
const Imagekit = require("imagekit");
const cities = require("./cities");

require('dotenv').config();

// Create a new Express app
const app = express();

// Accept cross-origin requests from the frontend app
const origin = process.env.SITE_URL || 'http://localhost:3000';
app.use(cors({ origin }));
app.use(express.json());

// Set up Auth0 configuration
const authConfig = {
  domain: "november-project.auth0.com",
  audience: "https://traverbal.november-project.com"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

const auth0 = new Auth0.ManagementClient({
  domain: authConfig.domain,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users update:users read:users_app_metadata update:users_app_metadata create:users_app_metadata'
});

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

// Define an endpoint that must be called with an access token
app.patch("/api/user", checkJwt, async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const user = await auth0.updateUser({ id: req.body.id }, data);
    res.send({ user });
  } catch(err) {
    res.status(500);
    res.send({ msg: 'An error occured.' });
    console.error(err);
  }
});

app.get("/api/user/photoToken", checkJwt, async (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.send(authParams);
  } catch(err) {
    res.status(500);
    res.send({ msg: 'An error occured.' });
    console.error(err);
  }
});

app.get("/api/cities", async (req, res) => {
  try {
    res.send(cities);
  } catch (err) {
    res.status(500);
    res.send({ msg: 'An error occured.' });
    console.error(err);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await auth0.getUsers();
    const us = users.reduce( (accum, user) => {
      if (user.user_metadata && user.user_metadata.badges) {
        return [ ...accum, {
          id: user.user_id,
          name: user.name,
          city: user.user_metadata.city,
          badges: user.user_metadata.badges,
          picture: user.picture,
        }];
      }
      return accum;
    }, []);
    res.send({ users: us });
  } catch(err) {
    res.status(500);
    res.send({ msg: 'An error occured.' });
    console.error(err);
  }
});

// Start the app
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on ${port}`));
