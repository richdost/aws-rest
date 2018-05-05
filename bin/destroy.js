#! /usr/bin/env node

let dynamoUtil = require('../src/dynamo-util');
let claudia = require('claudia');
let config = require('../config');

async function doit() {
  await dynamoUtil.deleteTables();
  await claudia.destroy({
    profile: config.aws.profile || 'claudia',
  });
}

doit();

