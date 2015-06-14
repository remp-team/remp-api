var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/users', function() {
  var newUser = {email: "tester1@remp.jp", password:"tester1remp"};
  var user2 = {
    id: 2,
    email: "tester2@remp.jp",
    username: "tester2",
    password: "tester2remp"
  };

  lt.beforeEach.withApp(app);

  lt.describe.whenCalledRemotely('GET', '/api/users', function() {
    it('未ログインの状態でusersモデルは取得できない', function() {
      assert.equal(this.res.statusCode, 401);
    });
  });

  lt.describe.whenCalledRemotely('PUT', '/api/users', function() {
    lt.it.shouldBeDenied();
  });

  lt.describe.whenCalledRemotely('POST', '/api/users', function() {
    it('パラメータが不十分な状態でPOSTした場合はステータス422', function() {
      assert.equal(this.res.statusCode, 422);
    });
  });

  describe('ユーザ登録', function() {
    lt.describe.whenCalledRemotely('POST', '/api/users', {}, function() {
      it('ユーザ登録の際にメールアドレス、パスワードのパラメータは必須', function() {
        var codes = this.res.body.error.details.codes;
        assert.include(codes.password, 'presence');
        assert.include(codes.email, 'presence');
        assert.include(codes.email, 'format.null');
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/users', newUser, function() {
      it('メールアドレス, パスワードを与えるとユーザ作成できる', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });

  describe('登録ユーザによるログイン', function() {
    lt.describe.whenCalledRemotely('POST', '/api/users/login', {}, function() {
      it('パラメータが無くリクエストした場合はステータス400でエラー', function() {
        assert.equal(this.res.statusCode, 400);
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/users/login', {email: newUser.email, password: "hogefoo"}, function() {
      it('パスワードを誤ってログインしようとした場合はステータス401でエラー', function() {
        assert.equal(this.res.statusCode, 401);
        assert.equal(this.res.body.error.code, "LOGIN_FAILED");
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/users/login', newUser, function() {
      it('ユーザ登録したメールアドレス,パスワードでログインできる', function() {
        assert.equal(this.res.statusCode, 200);
        assert.property(this.res.body, "id");
        assert.property(this.res.body, "ttl");
        assert.property(this.res.body, "userId");
      });
    });
  });

  describe('ユーザによるプレイリスト操作', function() {
    lt.describe.whenCalledRemotely('GET', '/api/users/1/playlists', function() {
      it('未ログインユーザはユーザ1のプレイリストは取得できない', function() {
        assert.equal(this.res.statusCode, 401);
      });
    });

    lt.describe.whenCalledByUser(user2, 'GET', '/api/users/1/playlists', function() {
      it('ログインしたユーザ自身のプレイリストは取得できる', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });
});
