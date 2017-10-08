'use strict';

const limberest = require('../../../limberest-js/lib/limberest');

function LimberestDemo() {
}

LimberestDemo.prototype.isBrowser = function() {
  return (typeof window !== 'undefined');  
};

// Returns options as appropriate for browser vs local. 
LimberestDemo.prototype.getOptions = function() {
  var testsLoc = '..';
  if (this.isBrowser()) {
    // in browser
    testsLoc = 'https://raw.githubusercontent.com/limberest/limberest-demo/master/test';
  }
  return {
    location: testsLoc,
    expectedResultLocation: testsLoc + '/results/expected',
    resultLocation: '../results/actual',
    debug: true,
    responseHeaders: ['content-type']
  }
};

LimberestDemo.prototype.setAuth = function(auth) {
  this.auth = auth;
}
LimberestDemo.prototype.getAuth = function(options, callback) {
  if (this.isBrowser()) {
    // setAuth called from limberest-ui client code
    callback(this.auth);
  }
  else {
    limberest.loadValues(options.location + '/auth.values', (err, auth) => {
      callback(err, auth);
    });
  }
};

// TODO: other than Basic
LimberestDemo.prototype.getAuthHeader = function(callback) {
  this.getAuth(this.getOptions(), (err, auth) => {
    if (err) {
      callback(err);
    }
    else if (auth) {
      if (this.isBrowser()) {
        return 'Basic ' + btoa(auth.user + ':' + auth.password);
      }
      else {
        return 'Basic ' + new Buffer(auth.user + ':' + auth.password).toString('base64');
      }
    }
    else {
      callback();
    }
  });
}

LimberestDemo.prototype.cleanupMovie = function(options, id, callback) {
  // authentication
  this.getAuthHeader((err, authHeader) => {
    if (err) {
      callback(err);
    }
    else {
      // programmatically run a single test against limberest.io
      limberest.loadValues(options.location + '/limberest.io.values', (err, vals) => {
        if (err) {
          callback(err);
        }
        else {
          var values = Object.assign({}, vals);
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
              values.id = id;
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
      });
    }
  });
};

module.exports = new LimberestDemo();