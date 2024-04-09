import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "@/../amplifyconfiguration.json";
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { Schema } from "../../amplify/data/resource";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { fetchAuthSession } from 'aws-amplify/auth/server';

import { NextRequest, NextResponse } from 'next/server';
import { defineBackend } from "@aws-amplify/backend";


export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config,
  cookies,
  authMode: "userPool",
});


export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await getCurrentUser(contextSpec);
        
        return !!user;
      } catch (error) {
        return false;
      }
    },
  });

// Assuming you have the bucket name stored somewhere accessible
const BUCKET_NAME = config.aws_user_files_s3_bucket;
const REGION = config.aws_user_files_s3_bucket;
// const ACCESS_KEY_ID = process.env.NEXT_AWS_S3_ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY;

export const uploadFromServer = async (file: Buffer, fileName: string) => 

  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const session = await fetchAuthSession(contextSpec);
        // console.log(session);
        const accessKeyId =  session.credentials?.accessKeyId;
        const secretAccessKey =  session.credentials?.secretAccessKey;
        const sessionToken =  session.credentials?.sessionToken;

        const s3Client = new S3Client([{
          region: REGION,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken
          }
        }]);
        
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: 'uploads/' + fileName,
          Body: file,
        };

        const uploadCommand = new PutObjectCommand(uploadParams);

        const uploadResult = await s3Client.send(uploadCommand);
        console.log('File uploaded successfully:', uploadResult);
        return uploadResult; // Return the S3 object URL
      }
       catch (error) {
        return error;
      }
    },
  });


