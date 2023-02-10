// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir : './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories : [ 'node_modules', '<rootDir>/' ],
  moduleNameMapper : {
    '@/(.*)$' : '<rootDir>/src/$1',
  },
  testEnvironment : 'jest-environment-jsdom',
  setupFilesAfterEnv : [ '<rootDir>/jest.setup.js' ],
};

module.exports = createJestConfig(customJestConfig);
