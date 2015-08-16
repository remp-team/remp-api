// Log
var GLOBAL_CONFIG = require("../global-config.js");
var winston = require('winston');
var slackWinston = require('slack-winston').Slack;

var options = {
  domain: 'remp',
  token: GLOBAL_CONFIG.slack.token,
  channel: '#remp',
  username: 'REMP API winston',
  message: '[{{level}}] {{message}}',
  level: 'warn'
}

winston.add(slackWinston, options)

module.exports = winston;

