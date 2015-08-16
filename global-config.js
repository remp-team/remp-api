/*
 * Global configuration shared by components.
 */

var conf = {
  youtubeApiKey: (process.env.YOUTUBE_API_KEY) ? process.env.YOUTUBE_API_KEY : "(YouTube Data API Key)",
  soundcloud: {
    id: (process.env.SOUNDCLOUD_APP_ID) ? process.env.SOUNDCLOUD_APP_ID : "(Soundcloud Application ID)"
  },
  vimeo: {
    accessToken: (process.env.VIMEO_API_TOKEN) ? process.env.VIMEO_API_TOKEN : "(Vimeo API Token)"
  },
  slack: {
    token: (process.env.REMP_SLACK_TOKEN) ? process.env.REMP_SLACK_TOKEN : "(Slack incoming hook token)"
  }
};

module.exports = conf;

