module.exports = {
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": process.env.FACEBOOK_CLIENT_ID,
    "clientSecret": process.env.FACEBOOK_SECRET_ID,
    "callbackURL": "/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": [],
    "failureFlash": true
  }
};
