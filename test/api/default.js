var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/', function() {
  lt.beforeEach.withApp(app);
  lt.describe.whenCalledRemotely('GET', '/', function() {
    it('should exist', function() {
      assert.equal(this.res.statusCode, 200);
    });
  });
});
