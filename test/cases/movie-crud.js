'use strict';

const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();

var movieId = '435b30ad';

demo.cleanupMovie(movieId, err => {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
  }
});