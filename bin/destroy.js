#! /usr/bin/env node

// todo maybe combine with destroy for one? e.g. rest create config.js
let awsRest = require('../index');
let fs = require('fs-extra');
let path = require('path');
let configFilePath = process.argv[2];

let config;
try {
  configFilePath = path.isAbsolute(configFilePath)
    ? configFilePath
    : process.cwd() + '/' + configFilePath;
  console.log('path:' + configFilePath);
  config = fs.readJsonSync(configFilePath);
}
catch (e) {
  console.error('Error reading JSON config file: ' + configFilePath);
  console.log('Usage: create-rest <configFile>');
  process.exit(1);
}

return awsRest.destroy(config);
