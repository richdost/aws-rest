
# dynamo-rest
Easy to use REST for AWS.
Just configure your REST collections then create.
Built on top of Claudia and AWS (DynamoDB, API-Gateway, Lambda).

#### Status
Working but rough. See todos below.

## Install
The usual
```javascript
> git clone this package
> cd dynamo-rest
> npm install
```

## AWS Basics

You need to have basic access to AWS. 

#### Credentials

Specify AWS profile in config.js. Your profile file might look something like this:

```bash
Tiny:aws-rest rd$ cat ~/.aws/credentials 
[default]
aws_access_key_id = your-access-key-id
aws_secret_access_key = very-super-secret
[claudia]
aws_access_key_id = key-id-for-claudia-work-with-lesser-power
aws_secret_access_key = but-still-it-is-secret 
```

## Deploy, Test, Clean
Optionally edit config.js for your collections. Then:

```bash
> create-rest
> npm test
> destroy-rest
```
You may have to rerun the tests if there is a slow lambda cold start.


## REST Operations
 - Post an array of objects or a single object to collection URI. Id is injected if missing. Resulting objects will be in response.
 - Put a single object to collectionUri/objectId. Id is injected if missing.
 - Delete to collectionUri/objectId removes a single object.
 - Get to collectionUri gets a bunch of objects. Pagination TODO. Or get to collectionUri/objectId to get one.

## To Do
Pending work...

#### Most Important
- Authentication by userId. See https://github.com/claudiajs/claudia-api-builder/blob/master/docs/authorization.md#cognito-authorization
- pagination for GET of collection
- GSIs declared in config and used via query parameters
- Tooling for supporting other projects. Helpful targets etc.

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


