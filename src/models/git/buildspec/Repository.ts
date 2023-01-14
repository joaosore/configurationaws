import { deleteFile, fileExists, saveYML } from '@hooks/file';
import { getModule } from '@hooks/system';
import { CreateBuildSpecDTO, DestroyBuildSpecDTO } from './dtos';
import { IRepositoryBuildSpec } from './IRepository/IRepositoryBuildSpec';

class Buildspec implements IRepositoryBuildSpec {
  constructor() {}

  async create({ region, ecr, module }: CreateBuildSpecDTO): Promise<void> {
    const data = {
      version: 0.2,
      phases: {
        install: {
          'runtime-version': {
            docker: 18,
            nodejs: 10,
          },
        },
        pre_build: {
          commands: [
            'echo Logging in to Amazon ECR...',
            'aws --version',
            `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${ecr}`,
          ],
        },
        build: {
          commands: [
            'echo Build started on "date"',
            'echo Building the Docker image...',
            'docker build -t ' + ecr + '/$ENV-' + getModule() + ':latest .',
            'docker tag ' +
              ecr +
              '/$ENV-' +
              getModule() +
              ':latest ' +
              ecr +
              '/$ENV-' +
              getModule() +
              ':latest',
          ],
        },
        post_build: {
          commands: [
            'echo Build completed on "date"',
            'echo Pushing the Docker images...',
            'docker push ' + ecr + '/$ENV-' + getModule() + ':latest',
            'echo Writing image definitions file...',
            'printf \'[{"name":"%s","imageUri":"%s"}]\' $ENV-' +
              getModule() +
              ' ' +
              ecr +
              '/$ENV-' +
              getModule() +
              ':latest > imagedefinitions.json',
            'cat imagedefinitions.json',
          ],
        },
      },
      artifacts: {
        files: ['imagedefinitions.json'],
      },
    };

    saveYML(module, data, 'buildspec.yml', 'createBuildSpec');
  }

  async destory({ module }: DestroyBuildSpecDTO): Promise<void> {
    let file = 'buildspec.yml';
    if (fileExists(module, file)) {
      deleteFile(module, file, 'DestroyBuildSpec');
    }
  }
}

export default Buildspec;
