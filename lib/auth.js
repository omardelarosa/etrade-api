var oauthUrl    = 'https://etws.etrade.com/oauth/';
var request     = require('request');
var querystring = require('querystring');
var config  = require('./config');

module.exports = {
  requestToken: function(key, secret, cb){

    var options = {
      url: config.buildAuthUrl('request_token'),
      oauth: {
        callback: 'oob',
        consumer_key: key,
        consumer_secret: secret,
      }
    };

    request.get(options, function(error, response, body){
      var res = config.parseBody(response.headers['content-type'], body);
      var authorizeUrl = 'https://us.etrade.com/e/t/etws/authorize?' +
                          querystring.stringify({ key: key, token: res.oauth_token });

      cb(error, res.oauth_token, res.oauth_token_secret, authorizeUrl);
    });
  },

  accessToken: function(verifier, key, secret, token, token_secret, cb){

    var options = {
      url: config.buildAuthUrl('access_token'),
      oauth: {
        consumer_key: key,
        consumer_secret: secret,
        token: token,
        token_secret: token_secret,
        verifier: vertifier
      }
    };

    request.get(options, function(error, response, body){
      var res = config.parseBody(response.headers["content-type"], body);
      cb(error, res.oauth_token, res.oauth_token_secret);
    });
  },

  renew: function(key, secret, token, token_secret, cb){
    var options = {
      url: config.buildAuthUrl('renew_access_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key: key,
        oauth_nonce: config.generateNonce(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: config.generateTimestamp(),
        oauth_token: token
      },
      headers: {}
    }

    options.qs.oauth_signature = config.generateSignature(options, secret,token_secret);
    request(options, function(error, response, body){
      var res = config.parseBody(response.headers["content-type"], body);
      cb(error, res.oauth_token, res.oauth_token_secret);
    });
  },

  revoke: function(key, secret, token, token_secret, cb){
    var options = {
      url: config.buildAuthUrl('revoke_access_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key: key,
        oauth_nonce: config.generateNonce(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: config.generateTimestamp(),
        oauth_token: token
      },
      headers: {}
    }

    options.qs.oauth_signature = config.generateSignature(options, secret,token_secret);
    request(options, function(error, response, body){
      var res = config.parseBody(response.headers["content-type"], body);
      cb(error, res.oauth_token, res.oauth_token_secret);
    });
  },

}
