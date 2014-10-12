var request = require('request');
var config  = require('./config');

module.exports = {
  listAccounts: function(keyTokens, params, cb, sandbox){
    var key = keyTokens.key;
    var secret = keyTokens.secret;
    var access_token = keyTokens.accessToken;
    var access_token_secret = keyTokens.accessTokenSecret;


    var options = config.generateOptions(key, 'accounts', 'accountlist', true, sandbox);
    options.qs.oauth_token = access_token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, secret, access_token_secret);
    options.qs = params;

    request(options, function(err, response, body){
      var res = config.parseBody(response.headers['content-type'], body);
      cb(err, res);
    });
  },
  balance: function(){

  }
};
