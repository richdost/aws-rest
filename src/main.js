
let claudia = require('claudia');
let fs = require('fs-extra');
let files = require('./files');
let dynamoUtil = require('./dynamo-util');
let build = require('../rest/build');
// TODO tests - will need to use Claudia parameters for where to put/get Claudia.json


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

function showTablesCreated(tableCreationResult){
  try {
    let tables = '';
    tableCreationResult.forEach(t => tables += t.TableDescription.TableName + ' ');
    console.log('Success creating tables:', tables);
  }
  catch (e) {
    console.warn('Minor error: failed to parse table names for creation message');
  }
}

async function create(config) {
  if (!files.isValidConfig(config)) return Promise.reject('create received invalid config parameter');
  //await fs.ensureDir(files.BUILD_DIR); // TODO move to build.js
  
  await build.writeJson('config.json', config);  // just for the record
  
  dynamoUtil.initAWS(config);
  
  let tableCreationResult = await dynamoUtil.createTables(config);
  showTablesCreated(tableCreationResult);
  await build.writeJson('table-creation-result.json', tableCreationResult);

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
  await build.writeJson('claudia-result.json', result);
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
  //return fs.readJson('./build/deployment-details.json');
  return build.readJson('deployment-details.json');
}

module.exports = {
  create,
  destroy,
  getDeploymentDetails,
};