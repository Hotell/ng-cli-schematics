const customConfig = {
  rules: {
    'header-max-length': [2, 'always', 100],
  },
};
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ...customConfig,
};
