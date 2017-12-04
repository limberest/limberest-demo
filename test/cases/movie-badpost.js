'use strict';

/** 
 * Programmatically run an orchestrated sequence of tests 
 * using promise syntax. TODO: regex example
 */ 

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');
const Case = limberest.Case;

var options = demo.getOptions();
const testCase = new Case('movie-badpost', options);
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
  // Try to post movie w/no title & invalid year
  logger.info('Cleanup completed for movie: ' + values.id);
  var post = group.getRequest('POST', 'movies');
  var movie = JSON.parse(post.body);
  delete movie.title;
  movie.year = 1812;
  post.body = JSON.stringify(movie, null, 2);
  return testCase.run(post, values);
})
.then(response => {
  // Confirm post was unsuccessful
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // load results
  return limberest.loadFile(options, 'results/expected/movies-api/movie-badpost.yaml');
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
