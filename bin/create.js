#! /usr/bin/env node

// todo make work with file argument
// todo maybe combine with destroy for one? e.g. rest create config.js

let awsRest = require('../index');
let fs = require('fs-extra');
let configFile = process.argv[2];

let config;
try {
  config = fs.readJsonSync(configFile);
}
catch (e) {
  console.error('Error reading JSON config file: ' + configFile);
  console.log('Usage: create-rest <configFile>');
  process.exit(1);
}

return awsRest.create(config);
