var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/youtube', function() {
  lt.beforeEach.withApp(app);

  lt.describe.whenCalledRemotely('GET', '/api/youtube/property?videoId=eZHEnPCEe0o', function() {
    it('YouTube動画のタイトルが取得できる', function() {
      var property = this.res.body.property;

      assert.equal(this.res.statusCode, 200);
      assert.equal(property.videoId, "eZHEnPCEe0o");
      assert.equal(property.title,   "Do Cool Things That Matter - Work at Google");
    });
  });

  lt.describe.whenCalledRemotely('GET', '/api/youtube/property?videoId=xxxlsfjkdjwo', function() {
    it('存在しないYouTube Video IDが渡された際は404応答', function() {
      assert.equal(this.res.statusCode, 404);
    });
  });

});

