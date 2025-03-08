module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    moduleNameMapper: {
        '^@services/(.*)$': '<rootDir>/functions/services/$1',
        '^@commands/(.*)$': '<rootDir>/functions/commands/$1',
        '^@data/(.*)$': '<rootDir>/functions/data/$1',
        '^@utils/(.*)$': '<rootDir>/functions/utils/$1',
        '^@types/(.*)$': '<rootDir>/functions/types/$1'
    }
};
