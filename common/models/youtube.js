var YoutubeApi= require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");

module.exports = function(Youtube) {
  Youtube.property = function(videoId, cb) {
    YoutubeApi.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    YoutubeApi.search.list({q:videoId, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
      console.log(data.items[0]);
      console.log(data.items[0].snippet.title);

      cb(null, {videoId: videoId});
    });
  }

  Youtube.remoteMethod(
    'property',
    {
      http: {verb: 'get'},
      accepts: {arg: 'videoId', type: 'string'},
      returns: {arg: 'property', type: 'string'}
    }
  );
};
