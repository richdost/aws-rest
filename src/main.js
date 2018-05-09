
let util = require('../src/util');
let claudia = require('claudia');
let fs = require('fs-extra');

// TODO tests - will need to use Claudia parameters for where to put/get Claudia.json

console.log('__dirname:' + __dirname);

const BASE_PATH = __dirname + '/../';   // __dirname points to aws/bin
const CONFIG_FILE = BASE_PATH + 'rest/config.json';
const BUILD_DIR = BASE_PATH + 'build';
const CLAUDIA_FILE = BASE_PATH + 'build/claudia.json';
const CLAUDIA_LAMBDA_PROJECT = BASE_PATH + 'rest';
const CLAUDIA_LAMBDA_POLICIES = BASE_PATH + 'policies';

async function create(config) {
  if (!util.isValidConfig(config)) return Promise.reject('create received invalid config parameter');
  await fs.ensureDir(BUILD_DIR);
  await fs.writeJson(CONFIG_FILE, config);
  util.initAWS(config);
  await util.createTables(config);
  const result = await claudia.create({  // https://github.com/claudiajs/claudia/blob/master/docs/create.md
    source: CLAUDIA_LAMBDA_PROJECT,
    config: CLAUDIA_FILE,
    region: config.aws.region || 'us-east-1',
    version: 'development',
    'api-module': 'rest',
    policies: CLAUDIA_LAMBDA_POLICIES,
    profile: config.aws.profile || 'claudia',
    timeout: 9,
    'aws-delay': 5000,
  });
  console.log('success:' + JSON.stringify(result));
  return result;
}

async function destroy() {
  let config = await fs.readJson(CONFIG_FILE);
  if (!util.isValidConfig(config)) return Promise.reject('destroy has invalid config');
  util.initAWS(config);
  await util.deleteTables(config);
  await claudia.destroy({
    profile: config.aws.profile || 'claudia',
    config: CLAUDIA_FILE,
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