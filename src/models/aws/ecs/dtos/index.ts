interface CreateTaskDefinitionDTO {
  params: object;
  module: string;
}

interface DestroyTaskDefinitionDTO {
  params: object;
  module: string;
}

interface CreateServiceDTO {
  params: object;
  module: string;
}

interface DestroyServiceDTO {
  params: object;
  module: string;
}

interface ListTaskDefinitionDTO {
  params: object;
}

interface CreateClusterDTO {
  params: object;
  module: string;
}

interface DestroyClusterDTO {
  params: object;
  module: string;
}

interface ECSConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export {
  CreateTaskDefinitionDTO,
  DestroyTaskDefinitionDTO,
  CreateServiceDTO,
  DestroyServiceDTO,
  ListTaskDefinitionDTO,
  CreateClusterDTO,
  DestroyClusterDTO,
  ECSConstructor,
};
