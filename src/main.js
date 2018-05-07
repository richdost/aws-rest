
let util = require('../src/util');
let claudia = require('claudia');
let fs = require('fs-extra');

//let defaultConfig = require('../config');

// TODO return config with additional props as output
// TODO optionally take file name instead of config (string vs object)
// TODO tests - will need to use Claudia parameters for where to put/get Claudia.json

// async function doBuild(config){
//   //await fs.ensureDir('./build/foo');
//   return Promise.all([
//     fs.writeJson('./rest/config.json', config),
//     //fs.copy('./src/rest.js', './build/foo/rest.js'),
//   ]);
// }

const CONFIG_FILE = './rest/config.json';
const CLAUDIA_FILE = './build/claudia.json';

async function create(config) {
  if (!util.isValidConfig(config)) return Promise.reject('create received invalid config parameter');
  //await doBuild(config);
  await fs.writeJson(CONFIG_FILE, config);
  util.initAWS(config);
  await util.createTables(config);
  const result = await claudia.create({
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

module.exports = {
  create,
  destroy,
  //doBuild, // exposed for testing only
};