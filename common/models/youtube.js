var YoutubeApi= require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");

module.exports = function(Youtube) {
  Youtube.property = function(videoId, cb) {
    YoutubeApi.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    YoutubeApi.search.list({q:videoId, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
      if (err) {
        cb(err, {});
      }

      if (data.items.length > 0) {
        cb(null, {videoId: videoId, title: data.items[0].snippet.title});
      } else {
        cb({statusCode:404, message:"Video not found."}, null);
      }
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
