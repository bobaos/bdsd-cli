#!/usr/bin/env node
const defaultSockFile = process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock';

// TODO: commands
const argv = require('yargs')
  .option('sockfile', {
    alias: 's',
    describe: `path to socket file. Default: ${process.env['XDG_RUNTIME_DIR']}/bdsd.sock'`,
    default: defaultSockFile
  })
  .argv;

let params = {
  sockFile: argv['sockfile']
};

require('../index.js')(params);
