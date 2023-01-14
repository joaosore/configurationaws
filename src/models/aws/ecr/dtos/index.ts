interface CreateRepositoryDTO {
  params: object;
  module: string;
}

interface DestroyRepositoryDTO {
  params: object;
  module: string;
}

interface ECRConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export { CreateRepositoryDTO, DestroyRepositoryDTO, ECRConstructor };
