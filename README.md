
# dynamo-rest
Easy to use REST for AWS.
Just configure your REST collections then create.
Built on top of Claudia and AWS (DynamoDB, API-Gateway, Lambda).

## Install
The usual
```javascript
> git clone this package
> cd dynamo-rest
> npm install
```
## Define your collections
Edit config.js for your collections.

## Deploy
```bash
npm run create
```

## Test
First create then test.
```bash
> npm run create
> npm test
```

## When done
```bash
npm run destroy
```

## REST Operations
 - Post an array of objects or a single object to collection URI. Id is injected if missing. Resulting objects will be in response.
 - Put a single object to collectionUri/objectId. Id is injected if missing.
 - Delete to collectionUri/objectId removes a single object.
 - Get to collectionUri gets a bunch of objects. Pagination TODO. Or get to collectionUri/objectId to get one.

## TODO
Pending work...

#### Most Important
- Authentication by userId. See https://github.com/claudiajs/claudia-api-builder/blob/master/docs/authorization.md#cognito-authorization
- pagination for GET of collection
- GSIs declared in config and used via query parameters

#### Minor
- Delete to collection with special header to guard against oops
- change role from backend-executor
- Sometimes create-details.json is empty. Seems like need to wait for something.
- AWS Profile hardcoded currently - should be taken from config

## Trouble-Shooting
- If there is an execution error is javascript during deploy then often the destroy won't clean up everything. Manually clean up in AWS console:
  - delete the role
  - delete the database tables
  - delete the lambda
- Sometimes create-details.json is empty. Needs to be fixed. In the meantime just redo.


