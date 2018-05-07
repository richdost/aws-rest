#! /usr/bin/env node

// todo make work with file argument
// todo maybe combine with destroy for one? e.g. rest create config.js

let awsRest = require('../index');
//let config = require('../test/config.js'); // temp because TODO as file parameter
awsRest.getDeploymentDetails()
.then(details => {
  console.log(JSON.stringify(details,null,2));
})
.catch(error => {
  console.log('Error occured. Perhaps rest was never deployed?');
  console.log(error);
});
