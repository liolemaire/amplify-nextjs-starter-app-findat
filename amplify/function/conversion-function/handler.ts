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
  console.log("event : " + JSON.stringify(event));
  const objectKeys = event.Records.map((record) => record.s3.object.key);

  const key = decodeURIComponent(event.Records[0].s3.object.key);

  if (key.includes('processed')) {
    console.log('File already processed. Skipping...');
    return;
  } else {
    console.log('processing ' + key);
  }

  const getObjectParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

    if (Body) {
      const stream = Body as Readable;

      const utf8Stream = stream.pipe(iconv.decodeStream('iso8859-1'))
      .pipe(iconv.encodeStream('utf8'));

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

      await processCsvWrapper(convertedFileName);

    }
    console.log("file handled");


  } catch (error) {
    console.error("Error processing CSV file", error);

  }

};

const options: Options = {
  separator: ';',
  newline: '\r'
};

const processCsvWrapper = async (key : any) =>{
  console.log('process csv wrapper received key : ' + key);

  if (key.includes('upload')) {
    console.log('File not converted. Skipping...');
    return;
  } else {
    console.log('processing ' + key);
  }

  const getObjectParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

    if (Body) {
      const stream = Body as Readable;
      await processCSV(stream);
    }
  } catch (error){
    console.log(error);
    
  }
}

const processCSV = async (stream: Readable) => {
  console.log('processing csv');
  console.log('stream' + JSON.stringify(stream));

  return new Promise<void>((resolve, reject) => {
    stream
      .pipe(csvParser(options))
      .on("data", async (row: CSVRow) => {
        // await insertIntoDynamoDB(row);
        console.log(' row : ' + row)
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

// const uploadFileToS3 = async (fileStream: Readable, key: string) => {
//   const params = {
//     client: s3Client,
//     params: {
//       Bucket: bucketName,
//       Key: key,
//       Body: fileStream
//     }
//   };

//   const upload = new Upload(params);

//   try {
//     const result = await upload.done(); // Start the upload process
//     console.log("File uploaded successfully:", result.Key);
//   } catch (error) {
//     console.error("Error uploading file to S3:", error);
//     throw error;
//   }
// };

