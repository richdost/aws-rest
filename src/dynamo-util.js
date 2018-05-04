
let AWS = require('aws-sdk');
let config = require('../config');
AWS.config.update({ region: config.aws.region });
let ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' }); // Create the DynamoDB service object

// returns promise
// Resolves null if table does not exist
function getTableState(TableName) {
  return new Promise( (resolve, reject) => {
    ddb.describeTable({ TableName }, function (error, data) {
      if (error && error.code !== 'ResourceNotFoundException'){
        console.log('getTableState describeTable error:'+JSON.stringify(error));
        reject(error);
      }
      else if (error) resolve(null);
      else resolve(data.Table.TableStatus);
    });
  });
}

// returns promise resolving to true if all tables in config have that state
// pass state null for table not to exist
function allTablesState(state) {
  return new Promise( async (resolve, reject) => {
    let promises = [];
    for (let tableName in config.collections) {
      promises.push(getTableState(tableName));
    }
    let resolution = await Promise.all(promises);
    resolve( resolution.every( r => r === state ));
  });
}

// Promise resolves when all tables are in state, or timeout
// pass state null for table not to exist
function whenTablesState(state, timeout = 20){
  return new Promise( (resolve, reject) => {
    async function resolveOrWait(count = 0) {
      if (await allTablesState(state)) resolve(true);
      else if (count > timeout) reject('timeout');
      else setTimeout(resolveOrWait.bind(null, ++count),1000);
    }
    resolveOrWait();
  });
}

// Creates all tables in the config.js
// test TODO
function createTables(){
  let promises = [];
  for (let tableName in config.collections){
    let info = config.collections[tableName];
    promises.push( createTable(tableName, info.ReadCapacityUnits, info.WriteCapacityUnits) );
  }
  return Promise.all(promises);
}

// test TODO
function createTable(TableName, ReadCapacityUnits = 1, WriteCapacityUnits = 1){
  var params = {
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'id', KeyType: 'RANGE' },
    ],
    ProvisionedThroughput: { ReadCapacityUnits, WriteCapacityUnits, },
    TableName,
    StreamSpecification: { StreamEnabled: false }
  };

  return new Promise( (resolve, reject) => {
    ddb.createTable(params, function (err, data) {
      if (err) {
        console.log("Error creating table", err);
        reject(err);
      }
      else {
        console.log("Success creating table", data);
        resolve(data);
      }
    });
  });

}

// Deletes all tables in the config.js
// test TODO
function deleteTables(){
  let promises = [];
  for (let tableName in config.collections) {
    promises.push(deleteTable(tableName));
  }
  return Promise.all(promises);
}

// test TODO
function deleteTable( TableName ){
  return new Promise((resolve, reject) => {
    ddb.deleteTable({ TableName }, function (err, data) {
      if (err && err.code === 'ResourceNotFoundException') {
        console.log("Error: Table not found");
        reject(new Error('Error table not found'));
      }
      else if (err && err.code === 'ResourceInUseException') {
        console.log("Error: Table in use");
        reject(new Error('Error table in use'));
      }
      else {
        console.log("Success", data);
        resolve(data);
      }
    });
  });
}

// async function doit(){
//   //return await put();
//   //return await getOne();
//   //return await createTables();
//   return await whenTablesState('ACTIVE');
// }
// doit()
//   .then( result => console.log('result:'+result))
//   .catch( error => console.log('error:'+error));

module.exports = {
  createTables,
  deleteTables,
  createTable,
  deleteTable,
  whenTablesState,
  allTablesState,
  getTableState,
};