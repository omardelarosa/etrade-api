require('./global');

var oauth_sign  = require('oauth-sign');
    querystring = require('querystring'),
    uuid        = require('uuid'),
    request     = require('request'),
    oauthUrl    = 'https://etws.etrade.com/oauth/';

module.exports = {
  buildUrl: function(module, action, json, sandbox){
    return 'https://' + this.hostName(sandbox) + this.buildPath(module, action, sandbox) + (json ? ".json" : "");
  },
  buildAuthUrl: function(module){
    return oauthUrl + module;
  },
  hostName: function(sandbox){
    return sandbox ? "etwssandbox.etrade.com" : "etws.etrade.com";
  },
  buildPath: function(module, action, sandbox){
    var buff = sandbox ? "/sandbox/rest/" : "/rest/";
    return "/" + module + buff + action;
  },
  generateNonce: function(){
    return uuid.v4();
  },
  generateSignature: function(options, secret, token_secret){
    return oauth_sign.hmacsign(options.method, options.url, options.qs, secret, token_secret);
  },

  generateTimestamp: function(){
      return Math.floor((new Date()).getTime()/1000);
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

  generateFullOptions: function(keyTokens, params, module, action, json, sandbox, method){
    var _this = this;
    var options = _this.generateOptions(keyTokens.key, module, action, json, sandbox, method);
    options.qs.oauth_token = keyTokens.token;
    options.qs.merge(params);
    options.headers['Authorization'] = _this.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    return options;
  },

  generateOptions: function(key, module, action, json, sandbox, method){
    var _this = this;
    options = {
      url: _this.buildUrl(module, action, json, sandbox),
      method: method ? method : 'GET',
      qs:  {
        oauth_consumer_key: key,
        oauth_nonce: _this.generateNonce(),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: _this.generateTimestamp(),
        oauth_version: '1.0'
      },
      headers: {}
    };

    return options;
  },

  generateAuthHeaders: function(requestOptions, secret, access_token_secret){
    var oauth_signature = this.generateSignature(requestOptions, secret, access_token_secret);
    return "OAuth realm=\"\"," +
            "oauth_version=\"" + encodeURIComponent(requestOptions.qs.oauth_version) + "\"," +
            "oauth_consumer_key=\"" + encodeURIComponent(requestOptions.qs.oauth_consumer_key) +"\"," +
            "oauth_token=\"" + encodeURIComponent(requestOptions.qs.oauth_token) + "\"," +
            "oauth_timestamp=\"" + encodeURIComponent(requestOptions.qs.oauth_timestamp) + "\"," +
            "oauth_nonce=\"" + encodeURIComponent(requestOptions.qs.oauth_nonce) + "\"," +
            "oauth_signature_method=\"" + encodeURIComponent(requestOptions.qs.oauth_signature_method) + "\"," +
            "oauth_signature=\"" + encodeURIComponent(oauth_signature) + "\"";
  },

  request: function(options, cb){
    var _this = this;
    request(options, function(err, response, body){
      if(err) return cb(err, null);
      cb(null, _this.parseBody(response.headers['content-type'], body));
    });
  }
}
