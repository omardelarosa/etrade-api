var request = require('request');
var config  = require('./config');

module.exports = {
  accounts: function(keyTokens, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, {}, 'accounts', 'accountlist', true, sandbox);

    config.request(options, function(err, res){
      if(err) return cb(err, null);
      cb(null, res['json.accountListResponse'].response);
    });
  },
  balance: function(keyTokens, accountId, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, {}, 'accounts', 'accountbalance/' + String(accountId), true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.accountBalanceResponse']);
    });
  },

  positions: function(keyTokens, accountId, params, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, params, 'accounts', 'accountpositions/' + String(accountId), true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.accountPositionsResponse'].response);
    });

  },

  transactions: function(keyTokens, accountId, params, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, params, 'accounts', String(accountId) + '/transactions', true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.transactions'].transactionList);
    });
  },

  transaction: function(keyTokens, accountId, transactionId, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, {}, 'accounts', String(accountId) + '/transactions/' + String(transactionId), true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.transactionDetails']);
    });
  },

  alerts: function(keyTokens, cb, sandbox){
    var options = config.generateFullOptions(keyTokens.key, {}, 'accounts', 'alerts', true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.getAlertsResponse'].response);
    });
  },

  alert: function(keyTokens, alertId, cb, sandbox){
    var options = config.generateFUllOptions(keyTokens, {}, 'accounts', 'alerts/' + String(alertId), true, sandbox);

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.getAlertDetailsResponse']);
    });
  },

  deleteAlert: function(keyTokens, alertId, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, {}, 'accounts', 'alerts/' + String(alertId), true, sandbox, 'DELETE');

    config.request(options, function(err, res){  
      if(err) return cb(err, null);
      cb(null, res['json.deleteAlertResponse']);
    });
  },

};
