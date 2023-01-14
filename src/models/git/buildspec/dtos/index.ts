interface CreateBuildSpecDTO {
  region: string;
  ecr: string;
  module: string;
}

interface DestroyBuildSpecDTO {
  module: string;
}

export { CreateBuildSpecDTO, DestroyBuildSpecDTO };
