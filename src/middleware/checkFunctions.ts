import dotenv from 'dotenv';
import { getCommand, getEnvironment } from '../hooks/system';

if (process.argv.includes('create') || process.argv.includes('delete')) {
  getCommand('module');
  getCommand('port');
  getCommand('env');
  getEnvironment();
}
