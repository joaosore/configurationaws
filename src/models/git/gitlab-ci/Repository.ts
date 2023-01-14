import { deleteFile, fileExists, saveYML } from '@hooks/file';
import { getModule, getEnv } from '@hooks/system';
import { IRepositoryGitlabCi } from './IRepository/IRepositoryBuildSpec';
import { CreateGitlabCiDTO, DestroyGitlabCiDTO } from './dtos';

class Gitlabci implements IRepositoryGitlabCi {
  constructor() {}

  async create({ s3, module }: CreateGitlabCiDTO): Promise<void> {
    const data = {
      variables: {
        S3: s3,
        Model: getModule(),
        Env: getEnv(),
      },
      workflow: {
        rules: [
          {
            if: '$CI_COMMIT_REF_NAME == "master"',
            variables: {
              Env: 'prod',
            },
          },
          {
            when: 'always',
          },
        ],
      },
      dockerbuild: {
        stage: 'deploy',
        image: 'registry.gitlab.com/gitlab-org/cloud-deploy/aws-base:latest',
        script: [
          'apt-get update',
          'apt-get install -y maven',
          'apt-get install -y openjdk-8-jdk',
          'mvn -version',
          'java -version',
          'export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"',
          'export PATH=$JAVA_HOME/bin:$PATH',
          'java -version',
          'mvn install -DskipTests',
          'apt-get install -y zip unzip',
          'zip -r build.zip target/*.jar Dockerfile buildspec.yml',
          'aws configure set default.region us-east-1',
          'aws s3 cp build.zip s3://$S3/builds/$Model/$Env/$Env-$Model.zip',
        ],
        only: ['homolog', 'master'],
      },
    };
    saveYML(module, data, '.gitlab-ci.yml', 'createGitlabCI');
  }

  async destory({ module }: DestroyGitlabCiDTO): Promise<void> {
    let file = '.gitlab-ci.yml';
    if (fileExists(module, file)) {
      deleteFile(module, file, 'deleteGitlabCI');
    }
  }
}

export default Gitlabci;
