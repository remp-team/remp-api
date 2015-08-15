var Youtube = require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");

module.exports = function(Search) {
  Search.youtube = function(pthis, next) {
    Youtube.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    Youtube.search.list({q:this.keyword, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
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

  Search.afterCreate = function(next) {
    var pthis = this;
    Search.youtube(pthis, next);
  };
};
