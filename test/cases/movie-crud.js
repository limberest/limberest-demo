'use strict';

/** 
 * Programmatically run an orchestrated sequence of tests 
 * using promise syntax.
 */ 

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
const testCase = new limberest.Case('movie-crud', options);
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
  return testCase.verify(values);
})
.then(result => {
  // tell the UI (limberest-ui)
  if (demo.getUiCallback())
    demo.getUiCallback()(null, result, values);
})
.catch(err => {
  logger.error(err);
  if (demo.getUiCallback())
    demo.getUiCallback()(err);
});
