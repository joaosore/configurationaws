interface CreateRoleDTO {
  params: object;
  module: string;
}

interface DestroyRoleDTO {
  params: object;
  module: string;
}

interface CreatePolicyDTO {
  params: object;
  module: string;
}

interface DestroyPolicyDTO {
  params: object;
  module: string;
}

interface AttachPolicyDTO {
  params: object;
}

interface DetachPolicyDTO {
  params: object;
}

interface IAMConstructor {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_DEFAULT_REGION: string;
}

export {
  CreateRoleDTO,
  DestroyRoleDTO,
  CreatePolicyDTO,
  DestroyPolicyDTO,
  AttachPolicyDTO,
  DetachPolicyDTO,
  IAMConstructor,
};
