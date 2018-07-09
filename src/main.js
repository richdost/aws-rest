
let claudia = require('claudia');
let fs = require('fs-extra');
let files = require('./files');
let dynamoUtil = require('../src/dynamo-util');

// TODO tests - will need to use Claudia parameters for where to put/get Claudia.json

console.log('__dirname:' + __dirname);

/*
Tiny:mind-map rd$ pwd
/Users/rd/dev/repo/mind-map
Tiny:mind-map rd$ ls build
deployment-details.json	dynamically-created.txt
Tiny:mind-map rd$ ls node_modules/aws-rest/build/
claudia.json
Tiny:mind-map rd$
*/

// const BASE_PATH = __dirname + '/../';   // __dirname points to aws/bin
// const CONFIG_FILE = BASE_PATH + 'rest/config.json';
// const BUILD_DIR = BASE_PATH + 'build';
// const CLAUDIA_FILE = BASE_PATH + 'build/claudia.json';
// const CLAUDIA_LAMBDA_PROJECT = BASE_PATH + 'rest';
// const CLAUDIA_LAMBDA_POLICIES = BASE_PATH + 'policies';

async function create(config) {
  if (!files.isValidConfig(config)) return Promise.reject('create received invalid config parameter');
  await fs.ensureDir(files.BUILD_DIR);
  await fs.writeJson(files.CONFIG_FILE, config);
  dynamoUtil.initAWS(config);
  await dynamoUtil.createTables(config);
  const result = await claudia.create({  // https://github.com/claudiajs/claudia/blob/master/docs/create.md
    source: files.CLAUDIA_LAMBDA_PROJECT,
    config: files.CLAUDIA_FILE,
    region: config.aws.region || 'us-east-1',
    version: config.version || 'development',
    'api-module': 'rest',
    policies: files.CLAUDIA_LAMBDA_POLICIES,
    profile: config.aws.profile || 'claudia',
    timeout: 9,
    'aws-delay': 5000,
  });
  console.log('success:' + JSON.stringify(result));
  return result;
}

async function destroy() {
  let config = await fs.readJson(files.CONFIG_FILE);
  if (!files.isValidConfig(config)) return Promise.reject('destroy has invalid config');
  dynamoUtil.initAWS(config);
  await dynamoUtil.deleteTables(config);
  await claudia.destroy({
    profile: config.aws.profile || 'claudia',
    config: files.CLAUDIA_FILE,
  });
}


async function getDeploymentDetails() {
  return fs.readJson('./build/deployment-details.json');
}

module.exports = {
  create,
  destroy,
  getDeploymentDetails,
};