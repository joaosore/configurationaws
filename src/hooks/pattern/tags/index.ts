import { getEnv, getModule } from '@hooks/system';

export const tags = [
  {
    Key: 'ENV',
    Value: getEnv(),
  },
  {
    Key: 'MODULE',
    Value: getModule(),
  },
];
