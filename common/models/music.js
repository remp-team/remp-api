module.exports = function(Music) {
  var urlValidation = /^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
  Music.validatesFormatOf('url', {with: urlValidation, message: 'Passed invnalid URL strings'});
};
