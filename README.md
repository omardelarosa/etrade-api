# Beta
Module is beta, not at a completed first release.

# etrade-api
The etrade-api module is a node.js implementation of the etrade RESTful api. It handles authorization, accounts, order, rate limits, and more.

## Installation
npm install etrade-api

## Usage
### Authorization
To beging using the etrade-api module you will need to handle authorization. Luckily the etrade-api has an easy method of doing this.
Below are the steps that you need to take to fully authorize your user and application to use the etrade-api module. You will also need
the following items: 
* Etrade api consumer key (will be referenced as key)
* Etrade api consumer secret key (will be refenced as secret)

1. Get a request token
```js
var etrade = require('etrade-api');
etrade.getRequestToken(key, secret, cb);
```
The callback for the Request Token method will take for argument:
  - _err_: If any error occurs throughout the process, the err argument will have a hold to this.
  - _request_token_: This is now your etrade api request token. 
  - _request_token_secret_: This is now your etrade api request token secret key.
  - _url_: This will be the url used to get the etrade verification code.

2. Get the verification code.
Follow these steps to get the verification code.
  1. Go the url you received from the previous step.
  2. Sign in to etrade if etrade prompts you to.
  3. Accept the agreement.
  4. Copy the verification code.

3. Get an access token
```js
var etrade = require('etrade-api');
etrade.getAccessToken(verificationCode, key, secret, request_token, request_token_secret, cb); 
```
The callback for the Access Token method will take for argument:
  - _err_: If any error occurs throughout the process, the err argument will have a hold to this.
  - _access_token_: This is now your etrade api access token. 
  - _access_token_secret_: This is now your etrade api access token secret key.

### Accounts
- listAccounts
- accountBalance
- accountPositions
- listAlerts
- readAlert
- deleteAlert
- transactionHistory
- transactionDetails

### Market
- optionChains
- optionExpireDates
- product
- quote

### Orders
- listOrders
- previewEquityOrder
- placeEquityOrder
- previewEquityOrderChange
- placeEquityOrderChange
- placeOptionOrder
- previewOptionOrder
- placeOptionOrderChange
- previewOptionOrderChange
- cancelOrder

### Rate Limits
- rateLimits

### Notifications
- messageList

## Author
M. Elliot Frost, CEO of [Frostware Technical Solutions, LLC](http://www.frostwaresolutions.net) 
