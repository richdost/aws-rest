#! /usr/bin/env node

// todo make work with file argument
// todo maybe combine with destroy for one? e.g. rest create config.js

let awsRest = require('../index');
let config = require('../test/config.js'); // temp because TODO as file parameter
return awsRest.destroy(config);
