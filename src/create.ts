import dotenv from 'dotenv';

dotenv.config();
const {
  AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  ID_ACCOUNT,
  S3_BUCKET,
  ECR,
  VPC,
  LOADBALANCERARN,
  CLUSTER_ECS,
} = process.env;

import { getEnv, getModule, getPort } from '@hooks/system';
import Buildspec from '@models/git/buildspec/Repository';
import Gitlabci from '@models/git/gitlab-ci/Repository';
import CodeBuild from '@models/aws/codebuild/Repository';
import IAM from '@models/aws/iam/Repository';

import { tags } from '@hooks/pattern/tags';
import { CodebuildServiceRole } from '@hooks/pattern/codebuild-service-role';
import { CodepipelineServiceRole } from '@hooks/pattern/codepipeline-service-role';
import { EventsServiceRole } from '@hooks/pattern/events-service-role';
import { CodeBuildBasePolicy } from '@hooks/pattern/codebuild-base-policy';
import { CodeBuildS3ReadOnlyPolicy } from '@hooks/pattern/codebuild-s3-read-only-policy';
import { AWSCodePipelineServicePolicy } from '@hooks/pattern/aws-codepipeline-server-policy';
import { StartPipelineExecution } from '@hooks/pattern/start-pipeline-execution';
import { getFile, readJSON } from '@hooks/file';
import { tags_v2 } from '@hooks/pattern/tags_v2';
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

const CreateUseCase = async (): Promise<void> => {
  await buildspec.create({
    ecr: ECR,
    module: `${getEnv()}-${getModule()}`,
    region: AWS_DEFAULT_REGION,
  });
  await gitlabci.create({
    s3: S3_BUCKET,
    module: `${getEnv()}-${getModule()}`,
  });

  // Roles
  await iam.createRole({
    params: {
      AssumeRolePolicyDocument: JSON.stringify(CodebuildServiceRole),
      RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
      Description: `${getEnv()}-${getModule()}`,
      MaxSessionDuration: 3600,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.createRole({
    params: {
      AssumeRolePolicyDocument: JSON.stringify(CodepipelineServiceRole),
      RoleName: `AWSCodePipelineServiceRole-service-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      MaxSessionDuration: 3600,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.createRole({
    params: {
      AssumeRolePolicyDocument: JSON.stringify(EventsServiceRole),
      RoleName: `cwe-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      MaxSessionDuration: 3600,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  // Policies
  await iam.createPolicy({
    params: {
      PolicyDocument: JSON.stringify(CodeBuildBasePolicy),
      PolicyName: `CodeBuildBasePolicy-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.createPolicy({
    params: {
      PolicyDocument: JSON.stringify(CodeBuildS3ReadOnlyPolicy),
      PolicyName: `CodeBuildS3ReadOnlyPolicy-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.createPolicy({
    params: {
      PolicyDocument: JSON.stringify(AWSCodePipelineServicePolicy),
      PolicyName: `AWSCodePipelineServicePolicy-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });
  await iam.createPolicy({
    params: {
      PolicyDocument: JSON.stringify(StartPipelineExecution),
      PolicyName: `start-pipeline-execution-policy-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
      Description: `${getEnv()}-${getModule()}`,
      Path: '/service-role/',
      Tags: tags,
    },
    module: `${getEnv()}-${getModule()}`,
  });

  console.log('...');

  setTimeout(async () => {
    // Attach
    if (getFile('CodeBuildBasePolicy')) {
      const file = getFile('CodeBuildBasePolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
        },
      });
    }

    if (getFile('CodeBuildS3ReadOnlyPolicy')) {
      const file = getFile('CodeBuildS3ReadOnlyPolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
        },
      });
    }

    await iam.attachPolicy({
      params: {
        PolicyArn:
          'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess',
        RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
      },
    });

    if (getFile('AWSCodePipelineServicePolicy')) {
      const file = getFile('AWSCodePipelineServicePolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `AWSCodePipelineServiceRole-service-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        },
      });
    }

    if (getFile('AWSCodePipelineServicePolicy')) {
      const file = getFile('start-pipeline-execution-policy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `cwe-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        },
      });
    }

    //Repository
    await repository.create({
      params: {
        repositoryName: `${getEnv()}-${getModule()}`,
        encryptionConfiguration: {
          encryptionType: 'AES256',
        },
        imageScanningConfiguration: {
          scanOnPush: false,
        },
        imageTagMutability: 'MUTABLE',
        tags,
      },
      module: `${getEnv()}-${getModule()}`,
    });
    console.log('...');
  }, 5000);

  setTimeout(async () => {
    // Attach
    if (getFile('CodeBuildBasePolicy')) {
      const file = getFile('CodeBuildBasePolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
        },
      });
    }

    if (getFile('CodeBuildS3ReadOnlyPolicy')) {
      const file = getFile('CodeBuildS3ReadOnlyPolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
        },
      });
    }

    await iam.attachPolicy({
      params: {
        PolicyArn:
          'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess',
        RoleName: `codebuild-${getEnv()}-${getModule()}-service-role`,
      },
    });

    if (getFile('AWSCodePipelineServicePolicy')) {
      const file = getFile('AWSCodePipelineServicePolicy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `AWSCodePipelineServiceRole-service-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        },
      });
    }

    if (getFile('AWSCodePipelineServicePolicy')) {
      const file = getFile('start-pipeline-execution-policy');
      await iam.attachPolicy({
        params: {
          PolicyArn: file.Policy.Arn,
          RoleName: `cwe-role-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        },
      });
    }

    //Repository
    await repository.create({
      params: {
        repositoryName: `${getEnv()}-${getModule()}`,
        encryptionConfiguration: {
          encryptionType: 'AES256',
        },
        imageScanningConfiguration: {
          scanOnPush: false,
        },
        imageTagMutability: 'MUTABLE',
        tags,
      },
      module: `${getEnv()}-${getModule()}`,
    });

    await codeBuild.create({
      params: {
        artifacts: {
          type: 'NO_ARTIFACTS',
        },
        environment: {
          type: 'LINUX_CONTAINER',
          image: 'aws/codebuild/amazonlinux2-x86_64-standard:4.0',
          computeType: 'BUILD_GENERAL1_SMALL',
          environmentVariables: [
            {
              name: 'ENV',
              value: getEnv(),
              type: 'PLAINTEXT',
            },
          ],
          privilegedMode: true,
          imagePullCredentialsType: 'CODEBUILD',
        },
        name: `${getEnv()}-${getModule()}`,
        serviceRole: `arn:aws:iam::${ID_ACCOUNT}:role/service-role/codebuild-${getEnv()}-${getModule()}-service-role`,
        source: {
          type: 'S3',
          location: `${S3_BUCKET}/builds/${getModule()}/${getEnv()}/${getEnv()}-${getModule()}.zip`,
          insecureSsl: false,
        },
        badgeEnabled: false,
        cache: {
          type: 'NO_CACHE',
        },
        encryptionKey: `arn:aws:kms:${AWS_DEFAULT_REGION}:${ID_ACCOUNT}:alias/aws/s3`,
        logsConfig: {
          cloudWatchLogs: {
            status: 'ENABLED',
          },
          s3Logs: {
            status: 'DISABLED',
            encryptionDisabled: false,
          },
        },
        queuedTimeoutInMinutes: 480,
        secondaryArtifacts: [],
        secondarySourceVersions: [],
        secondarySources: [],
        tags: tags_v2,
        timeoutInMinutes: 60,
      },
      module: `${getEnv()}-${getModule()}`,
    });

    console.log('...');
  }, 10000);

  setTimeout(async () => {
    // TargetGroup
    await elb.createTargetGroup({
      params: {
        Name: `target-group-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
        HealthCheckEnabled: true,
        HealthCheckIntervalSeconds: 30,
        HealthCheckPath: '/',
        HealthCheckPort: `${getPort()[0]}`,
        HealthCheckProtocol: 'HTTP',
        HealthCheckTimeoutSeconds: 5,
        HealthyThresholdCount: 5,
        Port: getPort()[0],
        Protocol: 'HTTP',
        ProtocolVersion: 'HTTP1',
        TargetType: 'instance',
        UnhealthyThresholdCount: 5,
        VpcId: VPC,
      },
      module: `${getEnv()}-${getModule()}`,
    });

    //TaskDefenition
    await ecs.registerTaskDefinition({
      params: {
        containerDefinitions: [
          {
            name: `${getEnv()}-${getModule()}`,
            image: `${ID_ACCOUNT}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${getEnv()}-${getModule()}:latest`,
            memory: 256,
            cpu: 256,
            essential: true,
            portMappings: [
              {
                containerPort: getPort()[1],
                hostPort: getPort()[0],
                protocol: 'tcp',
              },
            ],
          },
        ],
        family: `${getEnv()}-${getModule()}`,
      },
      module: `${getEnv()}-${getModule()}`,
    });

    if (getFile('target-group')) {
      const file = getFile('target-group');
      await elb.createListener({
        params: {
          DefaultActions: [
            {
              TargetGroupArn: file.TargetGroups.find(
                value =>
                  value.TargetGroupName ===
                  `target-group-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
              ).TargetGroupArn,
              Type: 'forward',
            },
          ],
          LoadBalancerArn: LOADBALANCERARN,
          Port: getPort()[0],
          Protocol: 'HTTP',
        },
        module: `${getEnv()}-${getModule()}`,
      });
    }

    // Register Service
    if (getFile('target-group')) {
      const file = getFile('target-group');
      await ecs.createService({
        params: {
          serviceName: `${getEnv()}-${getModule()}`,
          cluster: CLUSTER_ECS,
          deploymentConfiguration: {
            maximumPercent: '200',
            minimumHealthyPercent: '100',
          },
          desiredCount: '1',
          healthCheckGracePeriodSeconds: '1',
          launchType: 'EC2',
          loadBalancers: [
            {
              containerName: `${getEnv()}-${getModule()}`,
              containerPort: getPort()[1],
              targetGroupArn: file.TargetGroups.find(
                value =>
                  value.TargetGroupName ===
                  `target-group-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}`,
              ).TargetGroupArn,
            },
          ],
          role: 'ecsServiceRole',
          schedulingStrategy: 'REPLICA',
          taskDefinition: `${getEnv()}-${getModule()}`,
        },
        module: `${getEnv()}-${getModule()}`,
      });
    }

    if (getFile('AWSCodePipelineServiceRole-service-role')) {
      const file = getFile('AWSCodePipelineServiceRole-service-role');
      await codePipeline.create({
        params: {
          pipeline: {
            name: `${getEnv()}-${getModule()}`,
            roleArn: `${file.Role.Arn}`,
            stages: [
              {
                name: 'Source',
                actions: [
                  {
                    name: 'Source',
                    actionTypeId: {
                      category: 'Source',
                      owner: 'AWS',
                      provider: 'S3',
                      version: '1',
                    },
                    runOrder: 1,
                    configuration: {
                      PollForSourceChanges: 'false',
                      S3Bucket: S3_BUCKET,
                      S3ObjectKey: `builds/${getModule()}/${getEnv()}/${getEnv()}-${getModule()}.zip`,
                    },
                    outputArtifacts: [
                      {
                        name: 'SourceArtifact',
                      },
                    ],
                    inputArtifacts: [],
                    region: 'us-east-1',
                    namespace: 'SourceVariables',
                  },
                ],
              },
              {
                name: 'Build',
                actions: [
                  {
                    name: 'Build',
                    actionTypeId: {
                      category: 'Build',
                      owner: 'AWS',
                      provider: 'CodeBuild',
                      version: '1',
                    },
                    runOrder: 1,
                    configuration: {
                      ProjectName: `${getEnv()}-${getModule()}`,
                    },
                    outputArtifacts: [
                      {
                        name: 'BuildArtifact',
                      },
                    ],
                    inputArtifacts: [
                      {
                        name: 'SourceArtifact',
                      },
                    ],
                    region: AWS_DEFAULT_REGION,
                    namespace: 'BuildVariables',
                  },
                ],
              },
              {
                name: 'Deploy',
                actions: [
                  {
                    name: 'Deploy',
                    actionTypeId: {
                      category: 'Deploy',
                      owner: 'AWS',
                      provider: 'ECS',
                      version: '1',
                    },
                    runOrder: 1,
                    configuration: {
                      ClusterName: CLUSTER_ECS,
                      ServiceName: `${getEnv()}-${getModule()}`,
                    },
                    outputArtifacts: [],
                    inputArtifacts: [
                      {
                        name: 'BuildArtifact',
                      },
                    ],
                    region: AWS_DEFAULT_REGION,
                    namespace: 'DeployVariables',
                  },
                ],
              },
            ],
            artifactStore: {
              location: 'codepipeline-us-east-1-578121529054',
              type: 'S3',
            },
            version: 1,
          },
          tags: tags_v2,
        },
        module: `${getEnv()}-${getModule()}`,
      });
    }

    console.log('!!! DONE !!!');
  }, 15000);
};

export { CreateUseCase };
