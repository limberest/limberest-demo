'use strict';

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
var valuesFiles = ['global.values', 'limberest.io.values'];

var caseName = 'movie-delete';
var logger = demo.getLogger('movies-api', caseName);

// programmatically run an orchestrated sequence of tests
limberest.loadValues(options, valuesFiles, (err, vals) => {
  if (err) {
    logger.error(err);
    return;
  }
  
  var values = Object.assign({}, vals);
  
  limberest.loadGroup(options.location + '/movies-api.postman', (err, group) => {
    if (err) {
      logger.error(err);
    }
    else {
      // start a new case
      var testCase = new limberest.Case(caseName, options);
      testCase.authHeader = demo.getAuthHeader();

      // create a movie
      var del = group.getTest('DELETE', 'movies/{id}');
      testCase.run(del, values, (err, response) => {
        if (!err) {
          // verify results
          var res = testCase.verify(values, (err, result) => {
            if (err)
              logger.error(err);
            if (demo.getCallback())
              demo.getCallback()(err, result, values);
          });
        }
      });
    }
  });
});