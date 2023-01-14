import AWS from 'aws-sdk';
import { IRepositoryECS } from './IRepository/IRepositoryECS';
import {
  CreateTaskDefinitionDTO,
  DestroyTaskDefinitionDTO,
  CreateServiceDTO,
  DestroyServiceDTO,
  ECSConstructor,
  ListTaskDefinitionDTO,
  CreateClusterDTO,
  DestroyClusterDTO,
} from './dtos';
import { deleteFile, fileExists, saveJSON } from '@hooks/file';

const { ACCESSKEYID, SECRETACCESSKEY, REGION, ID_ACCOUNT } = process.env;

class ECS implements IRepositoryECS {
  private aws;

  constructor({
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION,
  }: ECSConstructor) {
    this.aws = new AWS.ECS({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_DEFAULT_REGION,
    });
  }
  async createCluster({ params, module }: CreateClusterDTO): Promise<void> {
    const data = await this.aws.createCluster(params).promise();
    return data;
  }
  destoryCluster({ params, module }: DestroyClusterDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async listTaskDefinition({ params }: ListTaskDefinitionDTO): Promise<void> {
    const data = await this.aws.listTaskDefinitions(params).promise();
    return data;
  }
  async registerTaskDefinition({
    params,
    module,
  }: CreateTaskDefinitionDTO): Promise<void> {
    if (!fileExists(module, `task-${module}.json`)) {
      try {
        const data = await this.aws.registerTaskDefinition(params).promise();
        saveJSON(module, `task-${module}.json`, data, 'registerTaskDefinition');
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(
        '\x1b[32m%s\x1b[0m',
        `OK -> Register Task Definition ${params.family}`,
      );
    }
  }
  async deregisterTaskDefinition({
    params,
    module,
  }: DestroyTaskDefinitionDTO): Promise<void> {
    try {
      await this.aws.deregisterTaskDefinition(params).promise();
      let file = `task-${module}.json`;
      if (fileExists(module, file)) {
        deleteFile(module, file, 'deregisterTaskDefinition');
      }
    } catch (err) {
      console.error(err);
    }
  }
  async createService({ params, module }: CreateServiceDTO): Promise<void> {
    if (!fileExists(module, `service-${module}.json`)) {
      try {
        const data = await this.aws.createService(params).promise();
        saveJSON(module, `service-${module}.json`, data, 'createService');
      } catch (err) {
        console.error(err);
      }
    }
  }
  async destoryService({ params, module }: DestroyServiceDTO): Promise<void> {
    try {
      await this.aws.deleteService(params).promise();
      let file = `service-${module}.json`;
      if (fileExists(module, file)) {
        deleteFile(module, file, 'deleteService');
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default ECS;
