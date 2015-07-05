var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/users', function() {
  var newUser = {email: "tester1@remp.jp", password:"tester1remp"};
  var newMusic = {title: "BTTB", type:"youtube", url:"https://www.youtube.com/watch?v=btyhpyJTyXg"};

  var userAlice = {
    id: 2,
    email: "tester2@remp.jp",
    username: "tester2",
    password: "tester2remp"
  };

  var userBob = {
    id: 3,
    email: "tester3@remp.jp",
    username: "tester3",
    password: "tester3remp"
  };

  var createPlayList = {
    title: "REMP PLAY LIST",
    published: true
  };

  var searchParams = {
    keyword: "YMO"
  };

  var musicParams = {
    title: "BTTB",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=btyhpyJTyXg"
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

  describe('ユーザ登録直後の状態のチェック', function() {
    lt.describe.whenCalledByUser(userAlice, 'GET', '/api/users/2/inbox', function() {
      it('ユーザ作成後は受信箱(inbox)ができている', function() {
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

  describe('プレイリスト関連のテスト', function() {
    describe('ユーザによるプレイリスト操作', function() {
      lt.describe.whenCalledRemotely('GET', '/api/users/1/playlists', function() {
        it('未ログインユーザはユーザのプレイリストは取得できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });

      lt.describe.whenCalledRemotely('POST', '/api/users/1/playlists', createPlayList, function() {
        it('未ログインユーザはユーザのプレイリスを作成できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/users/2/playlists', function() {
        it('ログインしたユーザ自身のプレイリストは取得できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/2/playlists', createPlayList, function() {
        it('ログインユーザはユーザのプレイリスを作成できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/users/1/playlists', function() {
        it('ログインしたユーザは他人のプレイリストは取得できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/1/playlists', createPlayList, function() {
        it('ログインユーザであっても他人のプレイリスを作成できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });
    });

    describe('プレイリストに付随する楽曲操作のテスト', function() {
      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/playlists/1/musics', {title:"NG"}, function() {
        it('楽曲のURLが無ければプレイリストに登録できない', function() {
          assert.equal(this.res.statusCode, 422);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/playlists/1/musics', {title:"NG", type:"youtube", url:"http"}, function() {
        it('不正なURLの楽曲はプレイリストに登録できない', function() {
          assert.equal(this.res.statusCode, 422);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/playlists/1/musics', musicParams, function() {
        it('プレイリストの所有者はプレイリストに楽曲を1曲登録できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/playlists/1/musics/1', function() {
        it('プレイリストの所有者はプレイリストに楽曲を1曲削除できる', function() {
          assert.equal(this.res.statusCode, 204);
        });
      });

      lt.describe.whenCalledByUser(userBob, 'POST', '/api/playlists/1/musics', musicParams, function() {
        it('プレイリストの所有者以外はプレイリストに楽曲を1曲登録できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });
    });

    describe('プレイリスト削除', function() {
      lt.describe.whenCalledByUser(userBob, 'DELETE', '/api/users/2/playlists/1', function() {
        it('プレイリストの所有者以外はプレイリストを削除できない', function() {
          assert.equal(this.res.statusCode, 404);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/users/2/playlists/1', function() {
        it('プレイリストの所有者はプレイリストを削除できる', function() {
          assert.equal(this.res.statusCode, 204);
        });
      });
    });
  });


  describe('ユーザによる曲の検索操作', function() {
    describe('楽曲検索', function() {
      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/2/searches', searchParams, function() {
        it('APIを介して楽曲の検索ができる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/2/searches', {keyword:""}, function() {
        it('検索キーワードが無い場合は検索が行えない', function() {
          assert.equal(this.res.statusCode, 422);
          assert.equal(this.res.body.error.name, "ValidationError");
        });
      });
    });

    describe('検索結果の概要取得', function() {
      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/1', function() {
        it('検索キーワードを再確認できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.keyword, searchParams.keyword);
        });
      });

      lt.describe.whenCalledByUser(userBob, 'GET', '/api/searches/1', function() {
        it('ログイン中の他人も検索キーワードを再確認できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.keyword, searchParams.keyword);
        });
      });

      lt.describe.whenCalledRemotely('GET', '/api/searches/1', function() {
        it('未ログインの状態で検索キーワードは再確認できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });
    });

    describe('検索結果の一覧取得', function() {
      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/1/musics', function() {
        it('楽曲の検索結果一覧を取得できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.length, 30);
        });
      });

      lt.describe.whenCalledByUser(userBob, 'GET', '/api/searches/1/musics', function() {
        it('ログインしたユーザは他人の楽曲の検索結果一覧を取得できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.length, 30);
        });
      });

      lt.describe.whenCalledRemotely('GET', '/api/searches/1/musics', function() {
        it('未ログインの状態で検索結果は取得できない', function() {
          assert.equal(this.res.statusCode, 401);
        });
      });
    });

    describe('検索結果に対する操作', function() {
      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/searches/1/musics/2', function() {
        it('プレイリストの所有者はプレイリストに楽曲を1曲削除できる', function() {
          assert.equal(this.res.statusCode, 204);
        });
      });
    });
  });

  describe('ユーザ間の楽曲の送受信', function() {
    lt.describe.whenCalledByUser(userAlice, 'POST', '/api/inboxes/3/musics', newMusic, function() {
      it('AliceはBobに楽曲を送ることができる', function() {
        assert.equal(this.res.statusCode, 200);
      });
    });

    lt.describe.whenCalledByUser(userBob, 'GET', '/api/inboxes/3/musics', function() {
      it('Bobのinboxには1曲楽曲が入っている', function() {
        assert.equal(this.res.statusCode, 200);
        assert.equal(this.res.body.length, 1);
        assert.equal(this.res.body[0].title, newMusic.title);
      });
    });

    lt.describe.whenCalledByUser(userAlice, 'GET', '/api/inboxes/3/musics', function() {
      it('AliceもBobのinboxの内容を確認できる', function() {
        assert.equal(this.res.statusCode, 200);
        assert.equal(this.res.body.length, 1);
        assert.equal(this.res.body[0].title, newMusic.title);
      });
    });

    lt.describe.whenCalledByUser(userBob, 'DELETE', '/api/inboxes/3/musics/32', function() {
      it('Bobのinboxに入った楽曲は受信者であるBobが削除できる', function() {
        assert.equal(this.res.statusCode, 204);
      });
    });
  });
});
