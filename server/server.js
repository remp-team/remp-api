var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Create an instance of PassportConfigurator with the app instance
var PassportConfigurator = require('loopback-component-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

require('loopback-ds-timestamp-mixin')(app);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // Load the provider configurations
  var config = {};
  try {
    config = require('./providers.js');
  } catch(err) {
    console.error(err);
    console.error('Please configure your passport strategy in `providers.json`.');
    console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
    process.exit(1);
  }

  // Initialize passport
  passportConfigurator.init();

  // Set up related models
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });

  // Configure passport strategies for third party auth providers
  for(var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

