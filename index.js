var auth    = require('./lib/auth');
var account = require('./lib/account');
var market  = require('./lib/market');

var etrade = {};

Object.keys(auth).forEach(function(key){
  etrade[key] = auth[key];
});

Object.keys(account).forEach(function(key){
  etrade[key] = account[key];
});

Object.keys(market).forEach(function(key){
  etrade[key] = market[key];
});

module.exports = etrade;
