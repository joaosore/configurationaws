import AWS from 'aws-sdk';
import { IRepositoryIAM } from './IRepository/IRepositoryIAM';
import {
  AttachPolicyDTO,
  CreatePolicyDTO,
  CreateRoleDTO,
  DestroyPolicyDTO,
  DestroyRoleDTO,
  DetachPolicyDTO,
  IAMConstructor,
} from './dtos';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';

class IAM implements IRepositoryIAM {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: IAMConstructor) {
    this.aws = new AWS.IAM({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }

  async attachPolicy({ params }: AttachPolicyDTO): Promise<void> {
    try {
      await this.aws.attachRolePolicy(params).promise();
      console.log(
        '\x1b[32m%s\x1b[0m',
        `OK -> Attach Role Policy ${params.RoleName}`,
      );
    } catch (err) {
      console.error(err);
    }
  }

  async detachPolicy({ params }: DetachPolicyDTO): Promise<void> {
    try {
      await this.aws.detachRolePolicy(params).promise();
    } catch (err) {}
  }

  async createPolicy({ params, module }: CreatePolicyDTO): Promise<void> {
    let file = `${params.PolicyName}.json`;
    if (!fileExists(module, file)) {
      try {
        const data = await this.aws.createPolicy(params).promise();
        saveJSON(module, file, data, 'createPolicy');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', `OK -> Policy ${params.PolicyName}`);
    }
  }
  async destoryPolicy({ params, module }: DestroyPolicyDTO): Promise<void> {
    let file = `${params.PolicyName}.json`;

    delete params.PolicyName;

    if (fileExists(module, file)) {
      try {
        await this.aws.deletePolicy(params).promise();
        deleteFile(module, file, 'deletePolicy');
      } catch (err) {
        console.error(err);
      }
    }
  }
  async createRole({ params, module }: CreateRoleDTO): Promise<void> {
    if (!fileExists(module, `${params.RoleName}.json`)) {
      try {
        const data = await this.aws.createRole(params).promise();
        saveJSON(module, `${data.Role.RoleName}.json`, data, 'createRole');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('\x1b[32m%s\x1b[0m', `OK -> Role ${params.RoleName}`);
    }
  }
  async destoryRole({ params, module }: DestroyRoleDTO): Promise<void> {
    let file = `${params.RoleName}.json`;
    if (fileExists(module, file)) {
      try {
        await this.aws.deleteRole(params).promise();
        deleteFile(module, file, 'deleteRole');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default IAM;
