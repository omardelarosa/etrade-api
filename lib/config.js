var crypto    = require('crypto');
var oauth_sign = require('oauth-sign');
var querystring = require('querystring');

module.exports = {
  buildUrl: function(module, action, json, sandbox){
    return 'https://' + this.hostName(sandbox) + this.buildPath(module, action, sandbox) + (json ? ".json" : "");
  },
  hostName: function(sandbox){
    return sandbox ? "etwssandbox.etrade.com" : "etws.etrade.com";
  },
  buildPath: function(module, action, sandbox){
    var buff = sandbox ? "/sandbox/rest/" : "/rest/";
    return "/" + module + buff + action;
  },
  generateNonce: function(timeStamp){
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
  },
  generateSignature: function(options, secret){
    return oauth_sign.hmacsign(options.method, options.url, options.qs, secret);
  },

  parseBody: function(contentType, body){
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
  },

  generateOptions: function(key, module, action, json, sandbox){
    var _this = this;
    var timestamp = new Date();
    options = {
      url: _this.buildUrl(module, action, json, sandbox),
      method: 'GET',
      qs:  {
        oauth_consumer_key: key,
        oauth_nonce: _this.generateNonce(timestamp),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(timestamp.getTime()/1000),
        oauth_version: '1.0'
      },
      headers: {}
    }

    return options;
  },

  generateAuthHeaders: function(requestOptions, secret, access_token_secret){
    var oauth_signature = oauth_sign.hmacsign(requestOptions.method,
                                              requestOptions.url,
                                              requestOptions.qs,
                                              secret,
                                              access_token_secret);
    return "OAuth realm=\"\"," +
            "oauth_version=\"" + encodeURIComponent(requestOptions.qs.oauth_version) + "\"," +
            "oauth_consumer_key=\"" + encodeURIComponent(requestOptions.qs.oauth_consumer_key) +"\"," +
            "oauth_token=\"" + encodeURIComponent(requestOptions.qs.oauth_token) + "\"," +
            "oauth_timestamp=\"" + encodeURIComponent(requestOptions.qs.oauth_timestamp) + "\"," +
            "oauth_nonce=\"" + encodeURIComponent(requestOptions.qs.oauth_nonce) + "\"," +
            "oauth_signature_method=\"" + encodeURIComponent(requestOptions.qs.oauth_signature_method) + "\"," +
            "oauth_signature=\"" + encodeURIComponent(oauth_signature) + "\"";
  }
}
