// Assumes REST system deployed with one collection mindmap.
// Do that with > npm run create-rest

let chai = require('chai');
let assert = chai.assert;
let dynamoUtil = require('../src/dynamo-util');
let fs = require('fs-extra');

let config;

describe (':', () => {

  before(() => {
    config = fs.readJsonSync('./rest/config.json');
    dynamoUtil.initAWS(config);
  });


  describe('table state functions', function () {

    it('getTableState:', async () => {
      assert('ACTIVE' == await dynamoUtil.getTableState('mindmap', config), 'mindmap table should be active');
      assert(null === await dynamoUtil.getTableState('xyz', config), 'xyz table should be null');
    });

    it('allTablesState:', async () => {
      assert(await dynamoUtil.allTablesState('ACTIVE', config), 'tables should be active - did you npm run create-rest?');
    });

    it('whenTablesState when all active:', async () => {
      assert(await dynamoUtil.whenTablesState('ACTIVE', config), 'should resolve to true quickly');
    });

    it('whenTablesState when timeout:', async () => {
      let didReject = false;
      try {
        await dynamoUtil.whenTablesState('no-such-state', config, 2);
      }
      catch (error) {
        didReject = error;
      }
      assert(didReject, 'Should have timed out');
    });

  });

});

