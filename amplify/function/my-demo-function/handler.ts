import type { S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Readable } from "stream";
import csvParser, { Options }  from "csv-parser";

import config from "../../../amplifyconfiguration.json";

//const csvParser = require("csv-parser");

const s3Client = new S3Client({ region: "us-east-1" });
const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

interface CSVRow {
  id: string;
  value: string;
}


export const handler: S3Handler = async (event) => {
  console.log("event records" + event.Records);
  const objectKeys = event.Records.map((record) => record.s3.object.key);

  console.log(`Upload handler invoked for objects [${objectKeys.join(', ')}]`);
  const bucketName = config.aws_user_files_s3_bucket;
  const REGION = config.aws_user_files_s3_bucket;
  const key = decodeURIComponent(event.Records[0].s3.object.key);

  console.log("BUCKET NAME" + bucketName);
  console.log("REGION" + REGION);
  console.log("KEY" + key);

  // const bucketName = event.Records[0].s3.bucket.name;
  
  const getObjectParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

    if (Body) {
      // await processCSV(Body as Readable);
      console.log(Body);
      await processCSV(Body as Readable);
    }
    console.log("file handled");
    
    
  } catch (error) {
    console.error("Error processing CSV file", error);
    
  }

};

const options : Options = {
    separator: ';',
    
  };

const processCSV = async (stream: Readable) => {
  return new Promise<void>((resolve, reject) => {
    stream
      .pipe(csvParser(options))
      .on("data", async (row: CSVRow) => {
        // await insertIntoDynamoDB(row);
        console.log(row)
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve();
      })
      .on("error", (error: any) => {
        console.error("Error parsing CSV file", error);
        reject();
      });
  });
};

// const insertIntoDynamoDB = async (row: CSVRow) => {
//   const params = {
//     TableName: "YourTableName",
//     Item: row,
//   };

//   try {
//     await docClient.send(new PutCommand(params));
//     console.log(`Inserted: ${row.id}`);
//   } catch (error) {
//     console.error("Error inserting into DynamoDB", error);
//   }
// };