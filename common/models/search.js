var Youtube = require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");
var Music = require('./music.js');

module.exports = function(Search) {
  Search.afterCreate = function(next) {
    Youtube.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    Youtube.search.list({q:this.keyword, part:"snippet", maxResults:5, type:"video"}, function(err, data) {
      data.items.forEach(function(item) {
        console.log(item.id.videoId);
        console.log(item.snippet.title);
        console.log("-----");
      });

      next();
    });
  };
};
