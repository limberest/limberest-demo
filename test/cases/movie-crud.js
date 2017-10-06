'use strict';

const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');

var options = demo.getOptions();

var movieId = '435b30ad';

demo.cleanupMovie(Object.assign({}, options, {debug: false}), movieId, (err, response) => {
  if (err) {
    console.log('Error: ' + err);
  }
  else {
    console.log('Cleanup response status: ' + response.status.code);
  }
});