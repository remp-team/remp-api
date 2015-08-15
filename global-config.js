/*
 * Global configuration shared by components.
 */

var conf = {
  youtubeApiKey: (process.env.YOUTUBE_API_KEY) ? process.env.YOUTUBE_API_KEY : "(YouTube Data API Key)",
  soundcloud: {
    id: (process.env.SOUNDCLOUD_APP_ID) ? process.env.SOUNDCLOUD_APP_ID : "(Soundcloud Application ID)"
  }
};

module.exports = conf;

