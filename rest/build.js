
// Used by both the rest submodule and the aws-rest main source
// to provide a common build location.

let os = require('os');
let fs = require('fs-extra');

console.log('homedir:' + os.homedir());
console.log('__dirname:' + __dirname);

const BUILD_DIR = os.homedir() + '/.aws-rest/build';

function addPath(fileName){
  return BUILD_DIR + '/' + fileName;
}

function getBuildDir(){
  return BUILD_DIR;
}

// resolves to URL of deployed REST system or rejection if not deployed
async function getApiUrl(){
  let claudiaResult = await readJson('claudia-result.json');
  return claudiaResult.api.url;
}

async function writeJson(fileName, o){
  await fs.ensureDir(BUILD_DIR);
  return fs.writeJson(addPath(fileName), o);
}

async function readJson(fileName){
  await fs.ensureDir(BUILD_DIR);
  return fs.readJson(addPath(fileName));
}

module.exports = {
  writeJson,
  readJson,
  getBuildDir,
  getApiUrl,
};
