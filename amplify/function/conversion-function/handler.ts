import type { S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Readable } from "stream";
import csvParser, { Options } from "csv-parser";
import { Upload } from "@aws-sdk/lib-storage";
import config from "../../../amplifyconfiguration.json";

//const csvParser = require("csv-parser");
const iconv = require("iconv-lite");
const REGION = config.aws_user_files_s3_bucket_region;
const bucketName = config.aws_user_files_s3_bucket;

const s3Client = new S3Client({ region: REGION });
const dynamoDBClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

interface CSVRow {
  id: string;
  value: string;
}


export const handler: S3Handler = async (event) => {
  console.log("s3client : " + s3Client);
  console.log("event : " + JSON.stringify(event));
  console.log("event records" + event.Records);
  const objectKeys = event.Records.map((record) => record.s3.object.key);

  console.log(`Upload handler invoked for objects [${objectKeys.join(', ')}]`);


  const key = decodeURIComponent(event.Records[0].s3.object.key);

  if (key.includes('processed')) {
    console.log('File already processed. Skipping...');
    return;
  }

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
      const stream = Body as Readable;

      const utf8Stream = stream.pipe(iconv.decodeStream('iso8859-1')).pipe(iconv.encodeStream('utf8'));

//      const convertedFileName = `processed/${key}`; // Modify the file name
      const convertedFileName = `processed/${key}`.replace('uploads/', ''); // Modify the file name


      const params = {
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: convertedFileName,
          Body: utf8Stream
        }
      };
      const upload = new Upload(params);
      try {
        const result = await upload.done(); // Start the upload process
        console.log("File uploaded successfully:", result.Key);
      } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
      }

      //await processCSV(Body as Readable);
    }
    console.log("file handled");


  } catch (error) {
    console.error("Error processing CSV file", error);

  }

};

const options: Options = {
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

const uploadFileToS3 = async (fileStream: Readable, key: string) => {
  const params = {
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: fileStream
    }
  };

  const upload = new Upload(params);

  try {
    const result = await upload.done(); // Start the upload process
    console.log("File uploaded successfully:", result.Key);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};