import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { myDemoFunction } from './function/conversion-function/resource'
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as cdk from 'aws-cdk-lib';
const backend = defineBackend({
  auth,
  data,
  storage,
  myDemoFunction
});

// create the bucket and its stack

// const bucketStack = backend.createStack('BucketStack');

// const bucket = new s3.Bucket(bucketStack, 'Bucket', {
//   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
// });

// // allow any authenticated user to read and write to the bucket

// const authRole = backend.auth.resources.authenticatedUserIamRole;

// bucket.grantReadWrite(authRole);

// // allow any guest (unauthenticated) user to read from the bucket

// const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;

// bucket.grantRead(unauthRole);

// backend.addOutput({

//   aws_user_files_s3_bucket: "myfindatwebsite",

//   aws_user_files_s3_bucket_region: "us-east-1",

// });
