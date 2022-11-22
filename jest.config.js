module.exports = {
    testMatch: ['**/src/**/(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testEnvironment: "miniflare",
    testEnvironmentOptions: {

    },
};
