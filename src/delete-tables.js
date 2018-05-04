

let dynamoUtil = require('./dynamo-util');

async function doit(){
  await dynamoUtil.deleteTables();
  console.log('-----------');
}

doit();
