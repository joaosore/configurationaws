import AWS from 'aws-sdk';
import { CreateS3DTO, DestroyS3DTO, S3Constructor } from './dtos';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';
import { IRepositoryS3 } from './IRepository/IRepositoryS3';

class S3 implements IRepositoryS3 {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: S3Constructor) {
    this.aws = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }

  async create({ params, env }: CreateS3DTO): Promise<void> {
    if (
      !fileExists(
        'settings',
        `s3-${params.Bucket}-${params.CreateBucketConfiguration.LocationConstraint}-${env}.json`,
      )
    ) {
      try {
        const data = await this.aws.createBucket(params).promise();
        // saveJSON(
        //   'settings',
        //   `s3-${params.Bucket}-${params.CreateBucketConfiguration.LocationConstraint}-${env}.json`,
        //   data,
        //   'createBucket',
        // );
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', `OK -> S3 ${params.Bucket}`);
    }
  }

  destory({ params, env }: DestroyS3DTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default S3;
