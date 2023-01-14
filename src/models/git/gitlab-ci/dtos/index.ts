interface CreateGitlabCiDTO {
  s3: string;
  module: string;
}

interface DestroyGitlabCiDTO {
  module: string;
}

export { CreateGitlabCiDTO, DestroyGitlabCiDTO };
