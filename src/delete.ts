import dotenv from 'dotenv';

dotenv.config();
const {
  AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  CLUSTER_ECS,
} = process.env;

import { getEnv, getModule, getPort } from '@hooks/system';
import Buildspec from '@models/git/buildspec/Repository';
import Gitlabci from '@models/git/gitlab-ci/Repository';
import CodeBuild from '@models/aws/codebuild/Repository';
import IAM from '@models/aws/iam/Repository';

import { getFile } from '@hooks/file';
import Repository from '@models/aws/ecr/Repository';
import ELB from '@models/aws/elb/Repository';
import ECS from '@models/aws/ecs/Repository';
import CodePipeline from '@models/aws/codepipeline/Repository';

const buildspec = new Buildspec();
const gitlabci = new Gitlabci();

const iam = new IAM({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const codeBuild = new CodeBuild({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const repository = new Repository({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const elb = new ELB({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const ecs = new ECS({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const codePipeline = new CodePipeline({
  AWS_ACCESS_KEY_ID,
  AWS_DEFAULT_REGION,
  AWS_SECRET_ACCESS_KEY,
});

const DestroyUseCase = async (): Promise<void> => {
  await buildspec.destory({
    module: `${getEnv()}-${getModule()}`,
  });
  await gitlabci.destory({
    module: `${getEnv()}-${getModule()}`,
  });

  // Attach
  if (getFile('CodeBuildBasePolicy')) {
    const file = getFile('CodeBuildBasePolicy');
    await iam.detachPolicy({
      params: {
        PolicyArn: file.Policy.Arn,
        RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
      },
    });
  }
  if (getFile('CodeBuildS3ReadOnlyPolicy')) {
    const file = getFile('CodeBuildS3ReadOnlyPolicy');
    await iam.detachPolicy({
      params: {
        PolicyArn: file.Policy.Arn,
        RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
      },
    });
  }
  await iam.detachPolicy({
    params: {
      PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess',
      RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
    },
  });
  if (getFile('AWSCodePipelineServicePolicy')) {
    const file = getFile('AWSCodePipelineServicePolicy');
    await iam.detachPolicy({
      params: {
        PolicyArn: file.Policy.Arn,
        RoleName: `AWSCodePipelineServiceRole-service-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      },
    });
  }
  if (getFile('AWSCodePipelineServicePolicy')) {
    const file = getFile('start-pipeline-execution-policy');
    await iam.detachPolicy({
      params: {
        PolicyArn: file.Policy.Arn,
        RoleName: `cwe-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      },
    });
  }

  // Policies

  if (getFile('CodeBuildBasePolicy')) {
    const file = getFile('CodeBuildBasePolicy');
    await iam.destoryPolicy({
      params: {
        PolicyName: file.Policy.PolicyName,
        PolicyArn: file.Policy.Arn,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }
  if (getFile('CodeBuildS3ReadOnlyPolicy')) {
    const file = getFile('CodeBuildS3ReadOnlyPolicy');
    await iam.destoryPolicy({
      params: {
        PolicyName: file.Policy.PolicyName,
        PolicyArn: file.Policy.Arn,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }
  if (getFile('AWSCodePipelineServicePolicy')) {
    const file = getFile('AWSCodePipelineServicePolicy');
    await iam.destoryPolicy({
      params: {
        PolicyName: file.Policy.PolicyName,
        PolicyArn: file.Policy.Arn,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }
  if (getFile('start-pipeline-execution-policy')) {
    const file = getFile('start-pipeline-execution-policy');
    await iam.destoryPolicy({
      params: {
        PolicyName: file.Policy.PolicyName,
        PolicyArn: file.Policy.Arn,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }

  // Roles
  await iam.destoryRole({
    params: {
      RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.destoryRole({
    params: {
      RoleName: `AWSCodePipelineServiceRole-service-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.destoryRole({
    params: {
      RoleName: `cwe-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  //Repository
  await repository.destory({
    params: {
      force: true,
      repositoryName: `${getEnv()}-${getModule()}`,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  // Codebuild
  await codeBuild.destory({
    params: {
      name: `${getEnv()}-${getModule()}`,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  if (getFile('lb-target-group')) {
    const file = getFile('lb-target-group');
    await elb.destoryListener({
      params: {
        ListenerArn: file.Listeners.find(value => value.Port == getPort()[0])
          .ListenerArn,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }

  // TargetGroup
  if (getFile('target-group')) {
    const file = getFile('target-group');

    await elb.destoryTargetGroup({
      params: {
        TargetGroupArn: file.TargetGroups.find(
          value =>
            value.TargetGroupName ===
            `target-group-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        ).TargetGroupArn,
        TargetGroupName: file.TargetGroups.find(
          value =>
            value.TargetGroupName ===
            `target-group-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        ).TargetGroupName,
      },
      module: `${getEnv()}-${getModule()}`,
    });
  }

  //TaskDefenition

  const listTasks = await ecs.listTaskDefinition({
    params: {
      familyPrefix: `${getEnv()}-${getModule()}`,
    },
  });

  listTasks.taskDefinitionArns.map(async item => {
    await ecs.deregisterTaskDefinition({
      params: {
        taskDefinition: item.split('/')[1],
      },
      module: `${getEnv()}-${getModule()}`,
    });
  });

  // Register Service
  await ecs.destoryService({
    params: {
      service: `${getEnv()}-${getModule()}`,
      cluster: CLUSTER_ECS,
      force: true,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  await codePipeline.destory({
    params: {
      name: `${getEnv()}-${getModule()}`,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  console.log('!!! DONE !!!');
};

export { DestroyUseCase };
