/*
 * Global configuration shared by components.
 */

var conf = {
  youtubeApiKey: (process.env.YOUTUBE_API_KEY) ? process.env.YOUTUBE_API_KEY : "(YouTube Data API Key)"
};

module.exports = conf;

