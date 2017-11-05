'use strict';

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
var valuesFiles = ['global.values', 'limberest.io.values'];

var caseName = 'movie-crud';
var logger = demo.getLogger('movies-api', caseName);

// programmatically run an orchestrated sequence of tests
limberest.loadValues(options, valuesFiles, (err, vals) => {
  if (err) {
    logger.error(err);
    return;
  }
  
  var values = Object.assign({}, vals);
  
  demo.cleanupMovie(values, (err, response) => {
    if (err) {
      logger.error(err);
    }
    else {
      logger.info('Cleanup completed for: ' + values.id);
      
      limberest.loadGroup(options.location + '/movies-api.postman', (err, group) => {
        if (err) {
          logger.error(err);
        }
        else {
          // start a new case
          var testCase = new limberest.Case(caseName, options);
          testCase.authHeader = demo.getAuthHeader();

          // create a movie
          var post = group.getRequest('POST', 'movies');
          testCase.run(post, values, (err, response) => {
            if (!err) {
              // update it (with programmatically-set rating)
              values.rating = 4.5;
              var put = group.getRequest('PUT', 'movies/{id}');
              testCase.run(put, values, (err, response) => {
                if (!err) {
                  // confirm update
                  var get = group.getRequest('GET', 'movies/{id}');
                  testCase.run(get, values, (err, response) => {
                    if (!err) {
                      // delete it
                      var del = group.getRequest('DELETE', 'movies/{id}');
                      testCase.run(del, values, (err, response) => {
                        // confirm delete
                        testCase.run(get, values, (err, response) => {
                          // verify results
                          var res = testCase.verify(values, (err, result) => {
                            if (err)
                              logger.error(err);
                            if (demo.getCallback())
                              demo.getCallback()(err, result, values);
                          });
                        });
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });    
    }
  });
});
