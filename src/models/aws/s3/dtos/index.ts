interface CreateS3DTO {
  params: object;
  env: string;
}

interface DestroyS3DTO {
  params: object;
  env: string;
}

interface S3Constructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export { CreateS3DTO, DestroyS3DTO, S3Constructor };
