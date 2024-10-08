module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/src/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  coverageDirectory: 'coverage',
};