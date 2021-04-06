module.exports = {
  branches: [{ name: 'main' }, { name: 'dev', channel: 'dev', prerelease: 'dev' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    ['@semantic-release/npm'],
    [
      '@semantic-release/git',
      {
        assets: ['src/**/*.ts', 'package.json']
      }
    ]
  ]
};
