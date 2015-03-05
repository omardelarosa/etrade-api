var request = require('request');
var config  = require('./config');
var module  = 'market';

module.exports = {
  chains: function(keyTokens, params, cb, sandbox){
    var opts = config.generateOpts(module, 'optionchains', true, sandbox);
    config.request(keyTokens, opts, params, config.callback(cb));
  },
  expireDate: function(keyTokens, params, cb, sandbox){
    var opts = config.generateOpts(module, 'optionexpiredate', true, sandbox);
    config.request(keyTokens, opts, params, config.callback(cb));
  },

  product: function(keyTokens, params, cb, sandbox){
    var opts = config.generateOpts(module, 'productlookup', true, sandbox);
    config.request(keyTokens, opts, params, config.callback(cb));
  },

  quote: function(keyTokens, symbol, cb, sandbox){
    var opts = config.generateOpts(module, 'quote/' + symbol, true, sandbox);
    config.request(keyTokens, opts, {}, config.callback(cb));
  }


};
