
let build = require('../rest/build');

// Shared file and directory definitions

/*
Tiny:mind-map rd$ pwd
/Users/rd/dev/repo/mind-map
Tiny:mind-map rd$ ls build
deployment-details.json	dynamically-created.txt
Tiny:mind-map rd$ ls node_modules/aws-rest/build/
claudia.json
Tiny:mind-map rd$
*/

const BUILD_DIR = build.getBuildDir();
const CLAUDIA_FILE = BUILD_DIR + '/claudia.json';

const BASE_PATH = __dirname + '/../';   // __dirname points to aws/bin
const CONFIG_FILE = BASE_PATH + 'rest/config.json';
const CLAUDIA_LAMBDA_PROJECT = BASE_PATH + 'rest';
const CLAUDIA_LAMBDA_POLICIES = BASE_PATH + 'policies';

function isValidConfig(config) {
  return (typeof config == 'object' && typeof config.collections == 'object');
}

module.exports = {
  BASE_PATH, CONFIG_FILE, BUILD_DIR, 
  CLAUDIA_FILE, CLAUDIA_LAMBDA_PROJECT, CLAUDIA_LAMBDA_POLICIES,
  isValidConfig,
};
