interface CreateCodeBuildDTO {
  params: object;
  module: string;
}

interface DestroyCodeBuildDTO {
  params: object;
  module: string;
}

interface CodeBuildConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export { CreateCodeBuildDTO, DestroyCodeBuildDTO, CodeBuildConstructor };
