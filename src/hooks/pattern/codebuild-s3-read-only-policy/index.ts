import { getEnv, getModule } from '@hooks/system';
import dotenv from 'dotenv';
dotenv.config();
const { S3_BUCKET } = process.env;

export const CodeBuildS3ReadOnlyPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['s3:GetObject', 's3:GetObjectVersion'],
      Resource: [
        `arn:aws:s3:::${S3_BUCKET}/builds/${getModule()}/${getEnv()}/${getEnv()}-${getModule()}.zip`,
        `arn:aws:s3:::${S3_BUCKET}/builds/${getModule()}/${getEnv()}/${getEnv()}-${getModule()}.zip/*`,
      ],
    },
    {
      Effect: 'Allow',
      Resource: [`arn:aws:s3:::${S3_BUCKET}`],
      Action: ['s3:ListBucket', 's3:GetBucketAcl', 's3:GetBucketLocation'],
    },
  ],
};
