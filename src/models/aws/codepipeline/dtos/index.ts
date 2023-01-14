interface CreateCodePipelineDTO {
  params: object;
  module: string;
}

interface DestroyCodePipelineDTO {
  params: object;
  module: string;
}

interface CodePipelineConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export {
  CreateCodePipelineDTO,
  DestroyCodePipelineDTO,
  CodePipelineConstructor,
};
