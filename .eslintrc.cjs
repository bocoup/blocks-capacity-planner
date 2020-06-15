module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', "plugin:mocha/recommended"
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks'],
    rules: {
        'indent': ['error', 4],
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'mocha/no-mocha-arrows': 0
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
