require('./global');

var querystring = require('querystring'),
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
  generateOpts: function(module, action, json, sandbox){
    return { module: module, action: action, json: json, sandbox: sandbox };
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

  callback: function(cb){
    return function(err, res){
      if(err) return cb(err, null);
      cb(null, res);
    };
  },

  request: function(keyTokens, opts, params, method, cb){
    var _this = this;
    var options = {
      url: _this.buildUrl(opts.module, opts.action, opts.json, opts.sandbox),
      oauth: {
        consumer_key: keyTokens.key,
        consumer_secret: keyTokens.secret,
        token: keyTokens.token,
        token_secret: keyTokens.token_secret
      },
      qs: params
    };
    if(typeof(method) == 'function') cb = method;
    else options.method = method;

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      cb(null, _this.parseBody(response.headers['content-type'], body));
    });
  }
}
