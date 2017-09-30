'use strict';

const limberest = require('limberest');

function LimberestDemo() {
}

// Returns options as appropriate for browser vs local. 
LimberestDemo.prototype.getOptions = function() {
  var testsLoc = '..';
  if (typeof window !== 'undefined') {
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

module.exports = new LimberestDemo();