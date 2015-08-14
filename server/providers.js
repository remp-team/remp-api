module.exports = {
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": process.env.FACEBOOK_CLIENT_ID ? process.env.FACEBOOK_CLIENT_ID : "ABC",
    "clientSecret": process.env.FACEBOOK_SECRET_ID ? process.env.FACEBOOK_SECRET_ID : "XYZ",
    "callbackURL": "/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/api/users/me/accessTokens",
    "failureRedirect": "/login",
    "scope": [],
    "failureFlash": true
  }
};
