var YoutubeApi= require("youtube-api");
var GLOBAL_CONFIG = require("../../global-config.js");
var logger = require("../../server/logger.js");

module.exports = function(Youtube) {
  Youtube.property = function(videoId, cb) {

    YoutubeApi.authenticate({
      type: "key",
      key: GLOBAL_CONFIG.youtubeApiKey
    });

    YoutubeApi.search.list({q:videoId, part:"snippet", maxResults:30, type:"video"}, function(err, data) {
      if (err) {
        logger.error("Youtube API calling failed.");
        cb(err, {});
      }

      if (data.items.length > 0) {
        cb(null, {videoId: videoId, title: data.items[0].snippet.title});
      } else {
        logger.warn("/api/YouTube/property : Invalid YouTube video Id passed.", {videoId: videoId});
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
