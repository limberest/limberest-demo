'use strict';

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const Logger = limberest.Logger;

function LimberestDemo() {
}

LimberestDemo.prototype.isBrowser = function() {
  return (typeof window !== 'undefined');  
};

LimberestDemo.prototype.setRemote = function(remote) {
  this.remote = remote;
}
LimberestDemo.prototype.isRemote = function() {
  return this.remote || this.isBrowser();
}

// Returns options as appropriate for browser vs local. 
LimberestDemo.prototype.getOptions = function() {
  var testsLoc = '..';
  var path = null;
  
  if (this.isRemote()) {
    // in browser
    testsLoc = 'https://raw.githubusercontent.com/limberest/limberest-demo/master/test';
  }
  return {
    location: testsLoc,
    expectedResultLocation: testsLoc + '/results/expected',
    resultLocation: '../results/actual',
    debug: true,
    responseHeaders: ['content-type', 'location'],
    retainResult: true,
    retainLog: true,
    extensions: ['env', 'values']
  }
};

LimberestDemo.prototype.setAuth = function(auth) {
  this.auth = auth;
}
LimberestDemo.prototype.getAuth = function(options) {
  if (this.isBrowser()) {
    return this.auth;
  }
  else {
    return limberest.loadValuesSync(options.location + '/auth.values');
  }
};

LimberestDemo.prototype.setCallback = function(callback) {
  this.callback = callback;
};
LimberestDemo.prototype.getCallback = function() {
  return this.callback;
};

// TODO: other than Basic
LimberestDemo.prototype.getAuthHeader = function() {
  var auth = this.getAuth(this.getOptions());
  if (this.isBrowser()) {
    return 'Basic ' + btoa(auth.user + ':' + auth.password);
  }
  else {
    return 'Basic ' + new Buffer(auth.user + ':' + auth.password).toString('base64');
  }
};

LimberestDemo.prototype.cleanupMovie = function(values, callback) {
  try {
    var options = Object.assign({}, this.getOptions(), {retainResult: false});
    var authHeader = this.getAuthHeader();
    // programmatically run a single test against limberest.io
    limberest.loadGroup(options.location + '/movies-api.postman', (err, group) => {
      if (err) {
        callback(err);
      }
      else {
        var test = group.getTest('DELETE', 'movies/{id}');
        if (!test.request.headers)
          test.request.headers = {};
        if (authHeader)
          test.request.headers.Authorization = authHeader;
        test.run(options, values, (err, response) => {
          if (err) {
            callback(err);
          }
          else {
            if (response.status.code === 200 || response.status.code === 404) {
              // success if deleted or not found
              callback(null, response);
            }
            else {
              callback(new Error(response.status.code + ': ' + response.status.message), response);
            }
          }
        });
      }
    });
  }
  catch (err) {
    callback(err);
  }
};

LimberestDemo.prototype.getLogger = function(group, caseName) {
  var options = this.getOptions();
  return new Logger({
    level: options.debug ? 'debug' : 'info',
    location: options.resultLocation + '/' + group,
    name: caseName + '.log', 
    retain: false
  });
  
};

module.exports = new LimberestDemo();