import { ConfigUseCase } from './config';
import { CreateUseCase } from './create';
import { DestroyUseCase } from './delete';

import './middleware/checkFunctions';

if (process.argv.includes('create')) {
  CreateUseCase();
}

if (process.argv.includes('delete')) {
  DestroyUseCase();
}

if (process.argv.includes('config')) {
  ConfigUseCase();
}
