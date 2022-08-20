module.exports = {
    moduleDirectories: ['./node_modules','./src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'node',
    transform: {
        '.*.tsx?$': '<rootDir>/node_modules/ts-jest'
    },
    moduleNameMapper: {
        '@core/(.*)': '<rootDir>/src/core/$1',
        '@app/(.*)': '<rootDir>/src/application/$1',
        '@framework/(.*)': '<rootDir>/src/framework/$1'
    },
    verbose: true,
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/src/prom.integration.test.ts'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}