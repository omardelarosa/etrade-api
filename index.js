var auth = require('./lib/auth.js');
var account = require('./lib/account.js');

var etrade = {};

Object.keys(auth).forEach(function(key){
  etrade[key] = auth[key];
});

Object.keys(account).forEach(function(key){
  etrade[key] = account[key];
});

module.exports = etrade;
