module.exports = function (argv) {
  var server = argv.server || 'local';

  return ({
    live: {
      IS_DEV: false,
      SERVER: 'live'
    },
    local: {
      IS_DEV: true,
      SERVER: 'local'
    }
  })[server];
};