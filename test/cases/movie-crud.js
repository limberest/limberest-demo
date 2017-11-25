'use strict';

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
var valuesFiles = ['global.values', 'limberest.io.values'];

// var caseName = 'movie-crud';
const testCase = new limberest.Case('movie-crud', options);
testCase.authHeader = demo.getAuthHeader();

const logger = demo.getLogger('movies-api', testCase.name);

let values;
let group;

// Programmatically run an orchestrated sequence of tests using promise syntax.
limberest.loadValues(options, valuesFiles)
.then(vals => {
  values = vals;
  return demo.cleanupMovie(vals);
})
.then(() => {
  logger.info('Cleanup completed for movie: ' + values.id);
  return limberest.loadGroup(options.location + '/movies-api.postman');
})
.then(grp => {
  group = grp;
  // create a movie
  var post = group.getRequest('POST', 'movies');
  return testCase.run(post, values);
})
.then(response => {
  // update it (with programmatically-set rating)
  values.rating = 4.5;
  var put = group.getRequest('PUT', 'movies/{id}');
  return testCase.run(put, values);
})
.then(response => {
  // confirm update
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // delete it
  var del = group.getRequest('DELETE', 'movies/{id}');
  return testCase.run(del, values);
})
.then(response => {
  // confirm delete
  var get = group.getRequest('GET', 'movies/{id}');
  return testCase.run(get, values);
})
.then(response => {
  // verify results
  var res = testCase.verify(values, (err, result) => {
    if (err)
      logger.error(err);
    if (demo.getUiCallback())
      demo.getUiCallback()(err, result, values);
  });
})
.catch(err => {
  logger.error(err);
});
