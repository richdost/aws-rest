let dynamoUtil = require('./dynamo-util');

async function doit(){
  await dynamoUtil.createTables();
  console.log('-----------');
}

doit();
