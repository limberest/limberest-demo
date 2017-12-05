'use strict';

// const limberest = require('limberest');
const limberest = require('../../../limberest-js/lib/limberest');
const demo = require('../lib/limberest-demo');
const Case = limberest.Case;

var options = demo.getOptions();
const testCase = new Case('movie-queries', options);

//to be replaced once loaded
var group = 'movies-api.postman';
var values = {'base-url': 'https://limberest.io/demo'};
var request;

limberest.loadGroup(options.location + '/' + group)
.then(loadedGroup => {
  group = loadedGroup;
  // 5-star movies from 1935
  values.query = 'rating=5&year=1935'; 
  request = group.getRequest('GET', 'movies?{query}');
  return testCase.run(request, values);
})
.then(response => {
  // movies with Phantom in the title
  values.query = 'title=Phantom'
  return testCase.run(request, values);
})
.then(response => {
  // top three movies with Bela Lugosi
  values.query = 'sort=rating&descending=true&max=3&search=Bela Lugosi'
  return testCase.run(request, values);
})
.then(response => {
  // the earliest movie directed by Alfred Hitchcock
  values.query = 'sort=year&max=1&search=Alfred Hitchcock'
  return testCase.run(request, values);
})
.then(response => {
  // prohibition-era stinkers
  values.query = 'rating=<2.5&year=<=1933'
  return testCase.run(request, values);
})
.then(response => {
  // query by id
  values.query = 'id=8f180e68'
  return testCase.run(request, values);
})
.then(response => {
  // load results
  return limberest.loadFile(options, 'results/expected/movies-api/movie-queries.yaml');
})
.then(expectedResult => {
  // compare expected vs actual
  var res = testCase.verifyResult(expectedResult, values);
  if (demo.getUiCallback()) {
    // tell the UI (limberest-ui)
    demo.getUiCallback()(null, res, values);
  }
})
.catch(err => {
  demo.getLogger('movies-api', testCase.name).error(err);
  if (demo.getUiCallback()) {
    demo.getUiCallback()(err);
  }
});
