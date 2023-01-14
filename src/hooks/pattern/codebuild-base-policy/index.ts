import { getEnv, getModule } from '@hooks/system';
import dotenv from 'dotenv';
dotenv.config();
const { AWS_DEFAULT_REGION, ID_ACCOUNT } = process.env;

export const CodeBuildBasePolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Resource: [
        `arn:aws:logs:${AWS_DEFAULT_REGION}:${ID_ACCOUNT}:log-group:/aws/codebuild/${getEnv()}-${getModule()}`,
        `arn:aws:logs:${AWS_DEFAULT_REGION}:${ID_ACCOUNT}:log-group:/aws/codebuild/${getEnv()}-${getModule()}:*`,
      ],
      Action: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    },
    {
      Effect: 'Allow',
      Resource: [`arn:aws:s3:::codepipeline-${AWS_DEFAULT_REGION}-*`],
      Action: [
        's3:PutObject',
        's3:GetObject',
        's3:GetObjectVersion',
        's3:GetBucketAcl',
        's3:GetBucketLocation',
      ],
    },
    {
      Effect: 'Allow',
      Action: [
        'codebuild:CreateReportGroup',
        'codebuild:CreateReport',
        'codebuild:UpdateReport',
        'codebuild:BatchPutTestCases',
        'codebuild:BatchPutCodeCoverages',
      ],
      Resource: [
        `arn:aws:codebuild:${AWS_DEFAULT_REGION}:${ID_ACCOUNT}:report-group/${getEnv()}-${getModule()}-*`,
      ],
    },
  ],
};
