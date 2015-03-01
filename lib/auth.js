var oauthUrl    = 'https://etws.etrade.com/oauth/';
var request     = require('request');
var crypto      = require('crypto');
var oauth_sign  = require('oauth-signature');
var querystring = require('querystring');
var uuid        = require('uuid');
var config  = require('./config');

function createRequest(url, query){
  var querys = [];
  var queries = Object.keys(query).map(function(key){
    return key + '=' + encodeURIComponent(query[key]);
  }).join('&');
  return url + '?' + queries;
}


module.exports = {
  requestToken: function(key, secret, cb){

    var options = {
      url: config.buildAuthUrl('request_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key:     key,
        oauth_nonce:            config.generateNonce(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp:         config.generateTimestamp(),
        oauth_version:          '1.0',
        oauth_callback:         'oob'
      },
      headers: {}
    }

    options.qs.oauth_signature = config.generateSignature(options, secret);

    
    request(options, function(error, response, body){
      var res = config.parseBody(response.headers['content-type'], body);
      var authorizeUrl = 'https://us.etrade.com/e/t/etws/authorize?' +
                          querystring.stringify({ key: key, token: res.oauth_token });

      cb(error, res.oauth_token, res.oauth_token_secret, authorizeUrl);
    });
  },

  accessToken: function(verificationCode, key, secret, token, token_secret, cb){

    var options = {
      url: config.buildAuthUrl('access_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key:     key,
        oauth_nonce:            config.generateNonce(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp:        config.generateTimestamp(),
        oauth_version:          '1.0',
        oauth_callback:         'oob'
      },
      headers: {}
    };

    options.qs.oauth_token = token;
    options.qs.oauth_verifier = verificationCode;

    options.qs.oauth_signature = config.generateSignature(options, secret, token_secret);
    request(options, function(error, response, body){
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
