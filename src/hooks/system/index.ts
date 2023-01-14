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

const getModule = () => {
  let text = process.argv.find(
    item => item.toLowerCase().indexOf('module=') > -1,
  );
  if (text) {
    let module = text.replace('module=', '');
    return module;
  }
};

const getPort = () => {
  let text = process.argv.find(
    item => item.toLowerCase().indexOf('port=') > -1,
  );
  let ports = text.replace('port=', '');
  let arrPort = ports.split(':');
  return arrPort;
};

const getEnv = () => {
  let text = process.argv.find(item => item.toLowerCase().indexOf('env=') > -1);
  let env = text.replace('env=', '');
  return env;
};

const getBucket = () => {
  let text = process.argv.find(
    item => item.toLowerCase().indexOf('bucket=') > -1,
  );
  let bucket = text.replace('bucket=', '');
  return bucket;
};

const getCluster = () => {
  let text = process.argv.find(
    item => item.toLowerCase().indexOf('cluster=') > -1,
  );
  let cluster = text.replace('cluster=', '');
  return cluster;
};

const getCommand = command => {
  const commandModule = process.argv.find(
    item => item.toLowerCase().indexOf(command) > -1,
  );

  if (commandModule) {
    let result = commandModule.includes('=');
    if (result) {
      console.log('\x1b[32m%s\x1b[0m', commandModule);
    } else {
      console.log(
        '\x1b[31m%s\x1b[0m',
        `O comando ${command} foi digitado de forma incorreta`,
      );
      throw new Error();
    }
  } else {
    console.log('\x1b[31m%s\x1b[0m', `Esta faltando o comando ${command}`);
    throw new Error();
  }
};

const getEnvironment = () => {
  if (AWS_ACCESS_KEY_ID === '') {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `A variavel AWS_ACCESS_KEY_ID não foi definida`,
    );
    throw new Error();
  }
  if (AWS_SECRET_ACCESS_KEY === '') {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `A variavel AWS_SECRET_ACCESS_KEY não foi definida`,
    );
    throw new Error();
  }
  if (AWS_DEFAULT_REGION === '') {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `A variavel AWS_DEFAULT_REGION não foi definida`,
    );
    throw new Error();
  }
  if (ID_ACCOUNT === '') {
    console.log('\x1b[31m%s\x1b[0m', `A variavel ID_ACCOUNT não foi definida`);
    throw new Error();
  }
  if (S3_BUCKET === '') {
    console.log('\x1b[31m%s\x1b[0m', `A variavel S3 não foi definida`);
    throw new Error();
  }
  if (CLUSTER_ECS === '') {
    console.log('\x1b[31m%s\x1b[0m', `A variavel CLUSTER_ECS não foi definida`);
    throw new Error();
  }
  if (VPC === '') {
    console.log('\x1b[31m%s\x1b[0m', `A variavel VPC não foi definida`);
    throw new Error();
  }
  if (LOADBALANCERARN === '') {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `A variavel LOADBALANCERARN não foi definida`,
    );
    throw new Error();
  }
  // ECR;
};

export {
  getModule,
  getPort,
  getEnv,
  getCommand,
  getEnvironment,
  getBucket,
  getCluster,
};
