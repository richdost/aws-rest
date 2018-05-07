// Assumes REST system deployed with one collection mindmap.
// Do that with > npm run create-rest

let chai = require('chai');
let assert = chai.assert;
let fs = require('fs-extra');
let main = require('../src/main');

let config;

describe (':', () => {

  // before(() => {
  //   config = fs.readJsonSync('./config.json');
  // });


  describe('test-main', function () {

    // it('doBuild:', async () => {
    //   await main.doBuild(config);
    //   assert(fs.existsSync('./build/foo/rest.js'), 'Expected build/foo/rest.js to exist');
    //   assert(fs.existsSync('./build/foo/config.json'), 'Expected build/foo/config.json to exist');
    // });

  });

});

