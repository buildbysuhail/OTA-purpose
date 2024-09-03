// webpack.config.js of the host application
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  // ... other webpack configurations
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      exposes: {
        './Header': './src/components/Header',
        './Footer': './src/components/Footer',
        './Sidebar': './src/components/Sidebar',
        './store': './src/store',
        './helpers': './src/helpers',
      },
      shared: ['react', 'react-dom', 'redux'],
    }),
  ],
};