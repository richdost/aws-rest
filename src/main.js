
let util = require('../src/util');
let claudia = require('claudia');
let fs = require('fs-extra');

// TODO tests - will need to use Claudia parameters for where to put/get Claudia.json

const CONFIG_FILE = './rest/config.json';
const CLAUDIA_FILE = './build/claudia.json';

async function create(config) {
  if (!util.isValidConfig(config)) return Promise.reject('create received invalid config parameter');
  await fs.ensureDir('./build');
  await fs.writeJson(CONFIG_FILE, config);
  util.initAWS(config);
  await util.createTables(config);
  const result = await claudia.create({  // https://github.com/claudiajs/claudia/blob/master/docs/create.md
    source: './rest',
    config: CLAUDIA_FILE,
    region: config.aws.region || 'us-east-1',
    version: 'development',
    'api-module': 'rest',
    policies: 'policies',
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


async function getDeploymentDetails(){
  return fs.readJson('./build/deployment-details.json');
}

module.exports = {
  create,
  destroy,
  getDeploymentDetails,
};