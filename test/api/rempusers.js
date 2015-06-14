var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/rempusers', function() {
  var newUser = {email: "tester1@remp.jp", password:"tester1remp"};

  lt.beforeEach.withApp(app);

  lt.describe.whenCalledRemotely('GET', '/api/rempusers', function() {
    it('未ログインの状態でrempusersモデルは取得できない', function() {
      assert.equal(this.res.statusCode, 401);
    });
  });

  lt.describe.whenCalledRemotely('PUT', '/api/rempusers', function() {
    lt.it.shouldBeDenied();
  });

  lt.describe.whenCalledRemotely('POST', '/api/rempusers', function() {
    it('パラメータが不十分な状態でPOSTした場合はステータス422', function() {
      assert.equal(this.res.statusCode, 422);
    });
  });

  describe('ユーザ登録', function() {
    lt.describe.whenCalledRemotely('POST', '/api/rempusers', {}, function() {
      it('ユーザ登録の際にメールアドレス、パスワードのパラメータは必須', function() {
        var codes = this.res.body.error.details.codes;
        assert.include(codes.password, 'presence');
        assert.include(codes.email, 'presence');
        assert.include(codes.email, 'format.null');
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/rempusers', newUser, function() {
      it('メールアドレス, パスワードを与えるとユーザ作成できる', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });
  });

  describe('登録ユーザによるログイン', function() {
    lt.describe.whenCalledRemotely('POST', '/api/rempusers/login', {}, function() {
      it('パラメータが無くリクエストした場合はステータス400でエラー', function() {
        assert.equal(this.res.statusCode, 400);
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/rempusers/login', {email: newUser.email, password: "hogefoo"}, function() {
      it('パスワードを誤ってログインしようとした場合はステータス401でエラー', function() {
        assert.equal(this.res.statusCode, 401);
        assert.equal(this.res.body.error.code, "LOGIN_FAILED");
      });
    });

    lt.describe.whenCalledRemotely('POST', '/api/rempusers/login', newUser, function() {
      it('ユーザ登録したメールアドレス,パスワードでログインできる', function() {
        assert.equal(this.res.statusCode, 200);
        assert.property(this.res.body, "id");
        assert.property(this.res.body, "ttl");
        assert.property(this.res.body, "userId");
      });
    });
  });
});
