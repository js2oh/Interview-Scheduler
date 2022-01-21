const path = require("path");

module.exports = async ({ config, mode }) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      modules: [path.resolve(__dirname, "../src"), ...config.resolve.modules]
    }
    ,
    devServer: {
      watchOptions: {
        poll: true, // or use an integer for a check every x milliseconds, e.g. poll: 1000,
        ignored: /node_modules/ // otherwise it takes a lot of time to refresh
      }
    }
  };
};
