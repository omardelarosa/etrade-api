var request = require('request');
var config  = require('./config');

module.exports = {
  accounts: function(keyTokens, cb, sandbox){

    var options = config.generateOptions(keyTokens.key, 'accounts', 'accountlist', true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null)
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.accountListResponse'].response);
    });
  },
  balance: function(keyTokens, accountId, cb, sandbox){

    var options = config.generateOptions(keyTokens.key, 'accounts', 'accountbalance/' + String(accountId), true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.accountBalanceResponse']);
    });
  },

  positions: function(keyTokens, accountId, params, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', 'accountpositions/' + String(accountId), true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = params;

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.accountPositionsResponse'].response);
    });

  },

  transactions: function(keyTokens, accountId, params, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', String(accountId) + '/transactions', true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = params;

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.transactions'].transactionList);
    });
  },

  transaction: function(keyTokens, accountId, transactionId, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', String(accountId) + '/transactions/' + String(transactionId), true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.transactionDetails']);
    });
  },

  alerts: function(keyTokens, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', 'alerts', true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.getAlertsResponse'].response);
    });
  },

  alert: function(keyTokens, alertId, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', 'alerts/' + String(alertId), true, sandbox);
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.getAlertDetailsResponse']);
    });
  },

  deleteAlert: function(keyTokens, alertId, cb, sandbox){
    var options = config.generateOptions(keyTokens.key, 'accounts', 'alerts/' + String(alertId), true, sandbox, 'DELETE');
    options.qs.oauth_token = keyTokens.token;
    options.headers['Authorization'] = config.generateAuthHeaders(options, keyTokens.secret, keyTokens.tokenSecret);
    options.qs = {};

    request(options, function(err, response, body){
      if(err) return cb(err, null);
      var res = config.parseBody(response.headers['content-type'], body);
      cb(null, res['json.deleteAlertResponse']);
    });
  },

};
