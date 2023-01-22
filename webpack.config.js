const slsw = require('serverless-webpack');
const nodeExternal = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: 'production',
    externals: [nodeExternal()]
}