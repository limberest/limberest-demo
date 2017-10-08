'use strict';

const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();

var movieId = '435b30ad';

const Case = limberest.Case;
var testCase = new Case('movie-crud', options);

demo.cleanupMovie(Object.assign({}, options, {debug: false}), movieId, (err, response) => {
  if (err) {
    testCase.logger.error('Cleanup error: ' + err);
  }
  else {
    testCase.logger.info('Cleanup response status: ' + response.status.code);
    testCase.authHeader = demo.getAuthHeader();
    
  }
});