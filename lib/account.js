var request = require('request');
var config  = require('./config');
var module  = 'accounts'

module.exports = {
  accounts: function(keyTokens, cb, sandbox){
    var opts = config.generateOpts(module, 'accountlist', true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));
  },
  balance: function(keyTokens, accountId, cb, sandbox){
    var opts = config.generateOpts(module, 'accountbalance/' + String(accountId), true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));  
  },

  positions: function(keyTokens, accountId, params, cb, sandbox){
    var opts = config.generateOpts(module, 'accountpositions/' + String(accountId), true, sandbox);
    config.request(keyTokens, opts, params, config.callback(cb));  
  },

  transactions: function(keyTokens, accountId, params, cb, sandbox){
    var opts = config.generateOpts(module, String(accountId) + '/transactions', true, sandbox);
    config.request(keyTokens, opts, params, config.callback(cb));  
  },

  transaction: function(keyTokens, accountId, transactionId, cb, sandbox){
    var opts = config.generateOpts(module, String(accountId) + '/transactions/' + String(transactionId), true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));  
  },

  alerts: function(keyTokens, cb, sandbox){
    var opts = config.generateOpts(module, 'alerts', true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));  
  },

  alert: function(keyTokens, alertId, cb, sandbox){
    var opts = config.generateOpts(module, 'alerts/' + String(alertId), true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));  
  },

  deleteAlert: function(keyTokens, alertId, cb, sandbox){
    var opts = config.generateOpts(module, 'alerts/' + String(alertId), true, sandbox);
    config.request(keyTokens, opts, 'DELETE', config.callback(cb));  
  },

};
