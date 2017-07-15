'use strict';

// example limberest-js test case
var limberest = require('limberest');

var env = limberest.env('../limberest.io.env');

var group =  limberest.group('../limberest-demo.postman');
var resp = limberest.run(group.api-docs);