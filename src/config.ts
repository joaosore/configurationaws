import { tags } from '@hooks/pattern/tags';
import { getBucket, getEnv, getModule } from '@hooks/system';
import ECS from '@models/aws/ecs/Repository';
import dotenv from 'dotenv';

dotenv.config();
const { AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  process.env;

// const s3 = new S3({
//   AWS_ACCESS_KEY_ID,
//   AWS_DEFAULT_REGION,
//   AWS_SECRET_ACCESS_KEY,
// });

const ecs = new ECS({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const ConfigUseCase = async (): Promise<void> => {
  // await s3.create({
  //   params: {
  //     Bucket: getBucket(),
  //     CreateBucketConfiguration: {
  //       LocationConstraint: 'us-east-1',
  //     },
  //   },
  //   env: getEnv(),
  // });

  await console.log('!!! DONE !!!');
};

export { ConfigUseCase };
