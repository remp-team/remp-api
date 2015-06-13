var Youtube = require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");

module.exports = function(Search) {
  Search.afterCreate = function(next) {
    Youtube.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    var pthis = this;

    Youtube.search.list({q:this.keyword, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
      data.items.forEach(function(item) {
        pthis.musics.create({title:item.snippet.title, type:"youtube", url:item.id.videoId}, function(err, obj){
        });
      });

      next();
    });
  };
};
