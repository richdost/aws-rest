
# aws-rest
Easy to use REST for AWS.
Just configure your REST collections then create.
Built on top of Claudia and AWS (DynamoDB, API-Gateway, Lambda).

#### Status
Working but rough. See todos below.

## Install

```javascript
> git clone https://github.com/richdost/aws-rest.git
> cd aws-rest
> npm install
```

## AWS Basics

You need to have basic access to AWS. 

#### AWS Credentials

Your AWS profile file is stored in ~/.aws/credentials and might look something like the below. Note the **claudia** profile.

```bash
Tiny:aws-rest rd$ cat ~/.aws/credentials 
[default]
aws_access_key_id = your-access-key-id
aws_secret_access_key = very-super-secret
[claudia]
aws_access_key_id = key-id-for-claudia-work-with-lesser-power
aws_secret_access_key = but-still-it-is-secret 
```

## REST Configuration
Specify your REST collections in ./rest/config.js. By default there is a single REST collection named **mindmap**.

**Currently the profile name of claudia is hardcoded**. Other names will not work. Todo fix.

```json
{
  "aws": {
    "region": "us-east-1",
    "profile":"claudia"
  },
  "collections":{
    "mindmap": {"ReadCapacityUnits": 3,"WriteCapacityUnits": 3}
  }
}
```

## Deploy, Test, Clean
After optionally editing rest/config.js for your collections:

```bash
> npm run create-rest
> npm run rest-details
> npm test
> npm run destroy-rest
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
- Add table property to collection entries so the table can have a different name.
- create-rest and destroy-rest bullet-proofing

## Trouble-Shooting
- If there is an execution error is javascript during deploy then often the destroy won't clean up everything. Manually clean up in AWS console:
  - delete the role
  - delete the database tables per the config
  - delete the lambda


