module.exports = function(Youtube) {
  Youtube.property = function(videoId, cb) {
    cb(null, {videoId: videoId});
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
