import * as migration_20250729_064344 from './20250729_064344';
import * as migration_20250817_060912 from './20250817_060912';

export const migrations = [
  {
    up: migration_20250729_064344.up,
    down: migration_20250729_064344.down,
    name: '20250729_064344',
  },
  {
    up: migration_20250817_060912.up,
    down: migration_20250817_060912.down,
    name: '20250817_060912'
  },
];
