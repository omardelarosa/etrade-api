var oauthUrl  = 'https://etws.etrade.com/oauth/';
var request   = require('request');
var crypto    = require('crypto');
var oauth_sign = require('oauth-sign');
var querystring = require('querystring');

// Private Functions
function buildUrl(module){
  return oauthUrl + module;
}
function createRequest(url, query){
  var querys = [];
  var queries = Object.keys(query).map(function(key){
    return key + '=' + encodeURIComponent(query[key]);
  }).join('&');
  return url + '?' + queries;
}

function generateNonce(timeStamp){
  var epochms   = timeStamp.getTime();
  var epochsc   = Math.floor(epochms / 1000.0);
  var msepochsc = (epochms - (epochsc * 1000)) / 1000.0;
  var randMax   = 2147483647.0;
  var rand      = Math.round(Math.random() * randMax);

  var timeString = "" + msepochsc + "00000 " + epochsc;
  var nonce = timeString + rand;

  var md5Hash = crypto.createHash('md5');
  md5Hash.update(nonce);
  return md5Hash.digest('hex');
}
function generateSignature(options, secret){
  return oauth_sign.hmacsign(options.method, options.url, options.qs, secret);
}

function parseBody(contentType, body){
    var contentTypes = {
            "application/x-www-form-urlencoded" : function(body)
            {
                return querystring.parse(body);
            },
            "application/json" : function(body)
            {
                return JSON.parse(body);
            },
            "text/html" : function(body)
            {
                return body; // Ugh.  Remove this content type after debugging...
            }
    };
    contentType = contentType.split(";")[0];

    if (typeof(contentTypes[contentType]) == 'function')
    {
        return contentTypes[contentType](body);
    }
    else
    {
        throw "Unrecognized content type: " + contentType + "\nbody:" + body;
    }
};
/////////////////////

module.exports = {
  getRequestToken: function(key, secret, cb){
    var timestamp = new Date();

    var options = {
      url: buildUrl('request_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key:     key,
        oauth_nonce:            generateNonce(timestamp),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp:         Math.floor(timestamp.getTime()/1000),
        oauth_version:          '1.0',
        oauth_callback:         'oob'
      },
      headers: {}
    }

    options.qs.oauth_signature = generateSignature(options, secret);

    
    request(options, function(error, response, body){
      var res = parseBody(response.headers['content-type'], body);
      var authorizeUrl = 'https://us.etrade.com/e/t/etws/authorize?' +
                          querystring.stringify({ key: key, token: res.oauth_token });

      cb(error, res.oauth_token, res.oauth_token_secret, authorizeUrl);
    });
  },

  getAccessToken: function(verificationCode, key, secret, token, token_secret, cb){
    var timestamp = new Date();

    var options = {
      url: buildUrl('access_token'),
      method: 'GET',
      qs: {
        oauth_consumer_key:     key,
        oauth_nonce:            generateNonce(timestamp),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp:        Math.floor(timestamp.getTime()/1000),
        oauth_version:          '1.0',
        oauth_callback:         'oob'
      },
      headers: {}
    };

    options.qs.oauth_token = token;
    options.qs.oauth_verifier = verificationCode;

    options.qs.oauth_signature = oauth_sign.hmacsign(options.method,
                                                     options.url,
                                                     options.qs,
                                                     secret,
                                                     token_secret);

    request(options, function(error, response, body){
      var res = parseBody(response.headers["content-type"], body);
      cb(error, res.oauth_token, res.oauth_token_secret);
    });
  }
}
