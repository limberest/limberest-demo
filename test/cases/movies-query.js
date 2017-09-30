'use strict';

const limberest = require('limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();

// programmatically run a single test against limberest.io
limberest.loadValues(options.location + '/limberest.io.values', function(err, vals) {
  if (err)
    throw err;
  var values = Object.assign({}, vals);
  limberest.loadGroup(options.location + '/movies-api.postman', function(err, group) {
    if (err)
      throw err;
    var test = group.getTest('GET', 'movies?{query}');
    // overriding some values
    values.query = 'year=1935&rating=5';
    test.run(options, values, (error, response) => {
      test.verify(values);
    });
  });
});