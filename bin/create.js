#! /usr/bin/env node

let dynamoUtil = require('../src/dynamo-util');
let claudia = require('claudia');
let config = require('../config');

async function doit() {
  await dynamoUtil.createTables();
  const result = await claudia.create({
    //name: 'lambda-function', 
    region: config.aws.region || 'us-east-1',
    version: 'development',
    'api-module': 'rest',
    //source: './..',
    policies: 'policies',
    profile: config.aws.profile || 'claudia',
    timeout: 9,
    'aws-delay': 5000,
  });
  console.log('success:' + JSON.stringify(result));  
}

doit();

