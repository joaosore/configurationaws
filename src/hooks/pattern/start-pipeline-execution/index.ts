import dotenv from 'dotenv';
import { getEnv, getModule } from '@hooks/system';

dotenv.config();
const { ID_ACCOUNT, AWS_DEFAULT_REGION } = process.env;

export const StartPipelineExecution = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['codepipeline:StartPipelineExecution'],
      Resource: [
        `arn:aws:codepipeline:${AWS_DEFAULT_REGION}:${ID_ACCOUNT}:${getEnv()}-${getModule()}`,
      ],
    },
  ],
};
