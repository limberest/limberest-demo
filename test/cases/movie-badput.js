'use strict';

/** 
 * Programmatically run an orchestrated sequence of tests 
 * using promise syntax. TODO: regex example
 */ 

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
const testCase = new limberest.Case('movie-badput', options);
testCase.authHeader = demo.getAuthHeader();

const values = {
  'base-url': 'https://limberest.io/demo',
  id: '435b30ad'
};
const logger = demo.getLogger('movies-api', testCase.name);

var group = 'movies-api.postman'; // to be replaced once loaded

limberest.loadGroup(options.location + '/' + group)
.then(loadedGroup => {
  group = loadedGroup;
  return demo.cleanupMovie(group, values);
})
.then(() => {
  logger.info('Cleanup completed for movie: ' + values.id);
  var post = group.getRequest('POST', 'movies');
  return testCase.run(post, values);
})
.then(response => {
  // Try to update it with an invalid, programmatically-set rating
  values.rating = 5.5;
  var put = group.getRequest('PUT', 'movies/{id}');
  return testCase.run(put, values);
})
.then(response => {
  // Confirm rating wasn't added
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // Delete it
  var del = group.getRequest('DELETE', 'movies/{id}');
  return testCase.run(del, values);
})
.then(response => {
  // Confirm delete
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // load results
  return limberest.loadFile(options, 'results/expected/movies-api/movie-badput.yaml');
})
.then(expectedResult => {
  // Compare expected vs actual
  var res = testCase.verifyResult(expectedResult, values);
  if (demo.getUiCallback()) {
    // Tell the UI (limberest-ui)
    demo.getUiCallback()(null, res, values);
  }
})
.catch(err => {
  logger.error(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});
