var lt = require('loopback-testing');
var chai = require('chai');
var assert = chai.assert;

//path to app.js or server.js
var app = require('../../server/server.js');

describe('/api/users', function() {
  var newUser = {email: "tester1@remp.jp", password:"tester1remp"};
  var newMusic = {title: "Amore", type:"youtube", url:"https://www.youtube.com/watch?v=5AGZuqB1rJk", order:1};
  var newMusics = [
    {title: "BTTB", type:"youtube", url:"https://www.youtube.com/watch?v=btyhpyJTyXg", order:1},
    {title: "Merry Christmas Mr Lawrence", type:"youtube", url:"https://www.youtube.com/watch?v=LGs_vGt0MY8", order:2}
  ];

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
    keyword: "YMO",
    source: "youtube"
  };

  var soundCloudSearchParams = {
    keyword: "shikakun",
    source: "soundcloud"
  };

  var vimeoSearchParams = {
    keyword: "nodejs",
    source: "vimeo"
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
      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/playlists/1/musics', newMusic, function() {
        it('プレイリストの所有者はプレイリストに楽曲を1曲登録できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

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

      lt.describe.whenCalledByUser(userAlice, 'POST', '/api/playlists/1/musics', newMusics, function() {
        it('プレイリストの所有者はプレイリストに楽曲を複数曲登録できる', function() {
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/playlists/1/musics', function() {
        it('プレイリストを取得した際はorderカラムの昇順で並び替えた上、orderカラムの値が一致した場合は更新日次を優先する', function() {
          assert.equal(this.res.body[0].title, newMusics[0].title);
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/playlists/1/musics?filter[order][0]=order ASC&filter[order][1]=updatedAt DESC', function() {
        it('filterを指定した上でプレイリストを取得した場合もパラメータ未指定の場合と一致する', function() {
          assert.equal(this.res.body[0].title, newMusics[0].title);
          assert.equal(this.res.statusCode, 200);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/playlists/1/musics/1', function() {
        it.skip('プレイリストの所有者はプレイリストに楽曲を1曲削除できる', function() {
          assert.equal(this.res.statusCode, 204);
        });
      });

      lt.describe.whenCalledByUser(userBob, 'POST', '/api/playlists/1/musics', newMusic, function() {
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
      describe('Youtube', function() {
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

      describe('Soundcloud', function() {
        lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/2/searches', soundCloudSearchParams, function() {
          it('APIを介して楽曲の検索ができる', function() {
            assert.equal(this.res.statusCode, 200);
          });
        });
      });

      describe('Vimeo', function() {
        this.timeout(30000);

        lt.describe.whenCalledByUser(userAlice, 'POST', '/api/users/2/searches', vimeoSearchParams, function() {
          it('APIを介して楽曲の検索ができる', function() {
            assert.equal(this.res.statusCode, 200);
          });
        });
      });
    });

    describe('検索結果の概要取得', function() {
      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/1', function() {
        it('YouTube 検索キーワードを再確認できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.keyword, searchParams.keyword);
          assert.property(this.res.body, "createdAt");
          assert.property(this.res.body, "updatedAt");
          assert.equal(this.res.body.source, "youtube");
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/2', function() {
        it('Soundcloud 検索キーワードを再確認できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.keyword, soundCloudSearchParams.keyword);
          assert.property(this.res.body, "createdAt");
          assert.property(this.res.body, "updatedAt");
          assert.equal(this.res.body.source, "soundcloud");
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/3', function() {
        it('Vimeo 検索キーワードを再確認できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.keyword, vimeoSearchParams.keyword);
          assert.property(this.res.body, "createdAt");
          assert.property(this.res.body, "updatedAt");
          assert.equal(this.res.body.source, "vimeo");
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
        it.skip('YouTube APIで検索した楽曲の検索結果一覧を取得できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.length, 30);
          assert.property(this.res.body[0], "createdAt");
          assert.property(this.res.body[0], "updatedAt");
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/2/musics', function() {
        it.skip('Soundcloud APIで検索した楽曲の検索結果一覧を取得できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body[0], "title");
          assert.equal(this.res.body[0].source, "soundcloud");
          assert.property(this.res.body[0], "createdAt");
          assert.property(this.res.body[0], "updatedAt");
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'GET', '/api/searches/3/musics', function() {
        it.skip('Vimeo APIで検索した楽曲の検索結果一覧を取得できる', function() {
          assert.equal(this.res.statusCode, 200);
          assert.equal(this.res.body.length, 30);
          assert.property(this.res.body[0], "createdAt");
          assert.property(this.res.body[0], "updatedAt");
        });
      });

      lt.describe.whenCalledByUser(userBob, 'GET', '/api/searches/1/musics', function() {
        it.skip('ログインしたユーザは他人の楽曲の検索結果一覧を取得できる', function() {
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
      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/searches/1/musics/4', function() {
        it.skip('検索結果の所有者は検索結果中の楽曲を1曲削除できる', function() {
          assert.equal(this.res.statusCode, 204);
        });
      });

      lt.describe.whenCalledByUser(userAlice, 'DELETE', '/api/users/2/searches/1', function() {
        it('検索結果の所有者は検索結果全体を削除できる', function() {
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
      it.skip('Bobのinboxには1曲楽曲が入っている', function() {
        assert.equal(this.res.statusCode, 200);
        assert.equal(this.res.body.length, 1);
        assert.equal(this.res.body[0].title, newMusic.title);
        assert.property(this.res.body[0], "createdAt");
        assert.property(this.res.body[0], "updatedAt");
      });
    });

    lt.describe.whenCalledByUser(userAlice, 'GET', '/api/inboxes/3/musics', function() {
      it.skip('AliceもBobのinboxの内容を確認できる', function() {
        assert.equal(this.res.statusCode, 200);
        assert.equal(this.res.body.length, 1);
        assert.equal(this.res.body[0].title, newMusic.title);
      });
    });

    lt.describe.whenCalledByUser(userBob, 'DELETE', '/api/inboxes/3/musics/34', function() {
      it.skip('Bobのinboxに入った楽曲は受信者であるBobが削除できる', function() {
        assert.equal(this.res.statusCode, 204);
      });
    });
  });
});
