var request = require('request');
var config  = require('./config');

module.exports = {
  chains: function(keyTokens, params, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, params, 'market', 'optionchains', true, sandbox);

    config.request(options, function(err, res){
      if(err) return cb(err, null);
      cb(null, res);
    });
  },
  expireDate: function(keyTokens, params, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, params, 'market', 'optionexpiredate', true, sandbox);

    config.request(options, function(err, res){
      if(err) return cb(err, null);
      cb(null, res.optionExpireDateGetResponse);
    });
  },

  product: function(keyTokens, params, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, params, 'market', 'productlookup', true, sandbox);

    config.request(options, function(err, res){
      if(err) return cb(err, null);
      cb(null, res.productLookupResponse);
    });
  },

  quote: function(keyTokens, symbol, cb, sandbox){
    var options = config.generateFullOptions(keyTokens, {}, 'market', 'quote/' + symbol, true, sandbox);

    config.request(options, function(err, res){
      if(err) return cb(err, null);
      cb(null, res.quoteResponse.quoteData);
    });
  }


};
