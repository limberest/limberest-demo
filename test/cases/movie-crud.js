'use strict';

const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();
var valuesFiles = ['global.values', 'limberest.io.values'];

const Case = limberest.Case;
var testCase = new Case('movie-crud', options);
var logger = testCase.logger;

// programmatically run an orchestrated sequence of tests
limberest.loadValues(options, valuesFiles, (err, vals) => {
  if (err)
    logger.error(err);

  var values = Object.assign({}, vals);
  
  demo.cleanupMovie(values, (err, response) => {
    if (err) {
      logger.error('Cleanup error: ' + err);
    }
    else {
      logger.info('Cleanup completed for: ' + values.id);
      testCase.authHeader = demo.getAuthHeader();
      
      limberest.loadGroup(options.location + '/movies-api.postman', (err, group) => {
        if (err) {
          logger.error(err);
        }
        else {
          // create a movie
          var post = group.getTest('POST', 'movies');
          testCase.run(post, values, (err, response) => {
            if (!err) {
              // update it
              var put = group.getTest('PUT', 'movies/{id}');
              testCase.run(put, values, (err, response) => {
                if (!err) {
                  // confirm update
                  var get = group.getTest('GET', 'movies/{id}');
                  testCase.run(get, values, (err, response) => {
                    if (!err) {
                      // delete it
                      var del = group.getTest('DELETE', 'movies/{id}');
                      testCase.run(del, values, (err, response) => {
                        // confirm delete
                        testCase.run(get, values, (err, response) => {
                          // verify results
                          var res = testCase.verify(values, (err, result) => {
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
