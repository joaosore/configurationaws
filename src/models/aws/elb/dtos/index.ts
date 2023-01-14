interface CreateTargetGroupDTO {
  params: object;
  module: string;
}

interface DestroyTargetGroupDTO {
  params: object;
  module: string;
}

interface CreateListenerDTO {
  params: object;
  module: string;
}

interface DestroyListenerDTO {
  params: object;
  module: string;
}

interface ELBConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export {
  CreateTargetGroupDTO,
  DestroyTargetGroupDTO,
  CreateListenerDTO,
  DestroyListenerDTO,
  ELBConstructor,
};
