var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/rempusers', function() {
  lt.beforeEach.withApp(app);

  lt.describe.whenCalledRemotely('GET', '/api/rempusers', function() {
    it('should fail invalid', function() {
      assert.equal(this.res.statusCode, 401);
    });
  });

  lt.describe.whenCalledRemotely('PUT', '/api/rempusers', function() {
    lt.it.shouldBeDenied();
  });

  lt.describe.whenCalledRemotely('POST', '/api/users', function() {
    it('should require validation', function() {
      assert.equal(this.res.statusCode, 422);
    });
  });
});
