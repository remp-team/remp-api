var Youtube = require("youtube-api");
var Soundcloud = require('node-soundcloud');

var GLOBAL_CONFIG = require("../../global-config.js");

module.exports = function(Search) {
  Search.youtube = function(keyword, pthis, next) {
    Youtube.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    Youtube.search.list({q:keyword, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
      var youtubeUrl, orderNumber=0;

      data.items.forEach(function(item) {
        youtubeUrl = "http://www.youtube.com/watch?v=" + item.id.videoId;
        pthis.musics.create({title:item.snippet.title, type:"youtube", url:youtubeUrl, order:orderNumber}, function(err, obj){
        });
        orderNumber++;
      });

      next();
    });
  };

  Search.soundcloud = function(keyword, pthis, next) {
    Soundcloud.init(GLOBAL_CONFIG.soundcloud);

    Soundcloud.get('/tracks?q=' + keyword, function(err, tracks) {
      var youtubeUrl, orderNumber=0;

      tracks.forEach(function(track) {
        pthis.musics.create({title:track.title, type:"soundcloud", url:track.permalink_url, order:orderNumber}, function(err, obj){
        });

        orderNumber++;
      });

      next();
    });
  };

  Search.afterCreate = function(next) {
    var pthis = this;

    switch(this.source) {
      case "soundcloud":
        Search.soundcloud(this.keyword, pthis, next);
        break;

      case "youtube":
      default:
        Search.youtube(this.keyword, pthis, next);
        break;
    }
  };
};
