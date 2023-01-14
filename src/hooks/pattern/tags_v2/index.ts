import { getEnv, getModule } from '@hooks/system';

export const tags_v2 = [
  {
    key: 'ENV',
    value: getEnv(),
  },
  {
    key: 'MODULE',
    value: getModule(),
  },
];
