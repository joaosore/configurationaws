import { getEnv, getModule } from '@hooks/system';
import * as fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';

dotenv.config();
const { AWS_DEFAULT_REGION } = process.env;

const saveJSON = (path, name, data, fn) => {
  let dirpath = `output/${path}`;
  fs.mkdirSync(dirpath, { recursive: true });

  var jsonContent = JSON.stringify(data);
  fs.writeFile(`${dirpath}/${name}`, jsonContent, 'utf8', function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }
    console.log(`${fn} - ${name} - Creaded.`);
  });
};

const deleteFile = (path, file, fn) => {
  let dirpath = `output/${path}`;
  fs.unlinkSync(`${dirpath}/${file}`);
  console.log(`${fn} - ${file} - Delete.`);
};

const saveYML = (path, data, name, fn) => {
  let dirpath = `output/${path}`;
  fs.mkdirSync(dirpath, { recursive: true });

  fs.writeFile(`${dirpath}/${name}`, yaml.dump(data), err => {
    if (err) {
      console.log(err);
    }
    console.log(`${fn} - ${name} - Creaded.`);
  });
};

const readJSON = (path, name) => {
  let dirpath = `output/${path}`;

  if (fileExists(path, name)) {
    let rawdata = fs.readFileSync(`${dirpath}/${name}`);
    let data = JSON.parse(rawdata.toString());
    return data;
  }
  return null;
};

const fileExists = (path, file) => {
  let dirpath = `output/${path}`;
  if (fs.existsSync(`${dirpath}/${file}`)) {
    return true;
  }
  return false;
};

const getFile = fileName => {
  try {
    let file = `${fileName}-${getEnv()}-${getModule()}-${AWS_DEFAULT_REGION}.json`;
    return readJSON(`${getEnv()}-${getModule()}`, file);
  } catch (err) {
    console.log(err);
  }
};

export { saveJSON, saveYML, deleteFile, readJSON, fileExists, getFile };
