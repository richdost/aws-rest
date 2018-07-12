
// implements a RESTful interface on the collections specified in config.js
let	AWS = require('aws-sdk');
let ApiBuilder = require('claudia-api-builder');
const uuidv4 = require('uuid/v4');
let fs = require('fs');

let build = require('./build');
let config = require('./config');

let ddb = new AWS.DynamoDB.DocumentClient();
let	api = new ApiBuilder();

module.exports = api;

function collectionExists(collection){
	return !!config.collections[collection];
}

function getNoSuchCollectionError(collection = '') {
	return new api.ApiResponse('Collection "' + collection + '" does not exist', { 'Content-Type': 'text/plain' }, 404);
}

function getNoSuchResourceError(resource = '') {
	return new api.ApiResponse('Resource "' + resource + '" does not exist', { 'Content-Type': 'text/plain' }, 404);
}

function getBodyRequiredError() {
	return new api.ApiResponse('Request body missing', { 'Content-Type': 'text/plain' }, 400);
}

function getBodyObjectOrArrayError() {
	return new api.ApiResponse('Request body must be object or array of objects', { 'Content-Type': 'text/plain' }, 400);
}

function isArrayOfObjects(aoo){
	if (!Array.isArray(aoo)) return false;
	for (let i=0;i<aoo.length;i++){
		if (typeof aoo[i] != 'object') return false;
	}
	return true;
}

// assumes body is object to be written - no error checking
function writeOne(body, collection){
	return new Promise((resolve, reject) => {
		body.id = body.id || uuidv4();
		var params = {
			TableName: collection,
			Item: {
				id: body.id,
				userId: 'Richard Dost',
				content: body,
			}
		};
		return ddb.put(params, (error, data) => {
			if (error) reject(error);
			else resolve(body);
		});
	});
}

api.put('/{collection}/{id}', request => {
	let collection = request.pathParams.collection;
	if (!collectionExists(collection)) return getNoSuchCollectionError(collection);
	let body = request.body;
	if (!body) return getBodyRequiredError();
	let id = request.pathParams.id;
	body.id = id;
	return writeOne(body, collection);
}, { success: 201 });


api.post('/{collection}', request => {
	const collection = request.pathParams.collection;
	let body = request.body;
	const isCollection = isArrayOfObjects(body);
	if (!collectionExists(collection)) return getNoSuchCollectionError(collection);
	if (!body) return getBodyRequiredError();
	if (typeof body != 'object' && !isCollection) return getBodyObjectOrArrayError();
	if (!isCollection) return writeOne(body, collection);
	let promises = [];
	for (let i = 0; i < body.length; i++) {
		promises.push(writeOne(body[i], collection));
	}
	return Promise.all(promises);
}, { success: 201 });


api.get('/{collection}/{id}', request => {
	let collection = request.pathParams.collection;
	let id = request.pathParams.id;
	if (!collectionExists(collection)) return getNoSuchCollectionError(collection);
	params = {
		TableName: collection,
		Key: {
			id,
			userId: 'Richard Dost'
		}
	};
	return ddb.get(params).promise()
	.then( response => {
		if (response.Item && response.Item.content) return response.Item.content;
		if (response.Item) return response.Item;
		return getNoSuchResourceError(id);
	})
	.catch(error => 'error:' + error);
});


api.get('/{collection}', request => {
	let collection = request.pathParams.collection;
	if (!collectionExists(collection)) return getNoSuchCollectionError(collection);
	let params = {
		TableName: collection,
		KeyConditionExpression: "userId = :userId",
		ExpressionAttributeValues: {
			":userId": 'Richard Dost'
		}
	};
	return new Promise( (resolve, reject) => {
		ddb.query(params).promise()
			.then((response) => {
				let body = response.Items.map(item => item.content);
				resolve(new api.ApiResponse(body, { 'Content-Type': 'application/json' }, 200));
			})
			.catch((error) => {
				console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
				return error;
			});
	});
	
});

api.delete('/{collection}/{id}', request => {
	let collection = request.pathParams.collection;
	if (!collectionExists(collection)) return getNoSuchCollectionError(collection);
	let id = request.pathParams.id;
	let params = {
		TableName: collection,
		Key: {
			id,
			userId: 'Richard Dost'
		}
	};
	return ddb.delete(params).promise()
		.then(function () {
			return 'Deleted id "' + id + '"';
		});
}, {success: { contentType: 'text/plain'}});

// Saves the API URL so tests can run without coping URL
// Seems like Claudia should save it somewhere but it is not going to claudia.json.
// If so this can be replaced.
// api.addPostDeployStep('message', (options, lambdaDetails, utils) => {
// 	const details = JSON.stringify(lambdaDetails, null, 2);
// 	const fileName = build.getBuildDir() + '/deployment-details.json';
// 	fs.writeFile(fileName, details, (err) => {
// 		if (err) console.log('Error writing ' + fileName + ': ' + err);
// 	});
// });

