#!/usr/bin/env node
const defaultSockFile = `${process.env['XDG_RUNTIME_DIR']}/bdsd.sock`;

const program = require('commander');

program
  .option(
    '-s --sockfile <path>',
    `path to socket file. Default: ${defaultSockFile}`
  )
  .parse(process.argv);

let params = {
  sockFile: defaultSockFile
};

if (program['sockfile']) {
  params.sockFile = program['sockfile'];
}

require('../index.js')(params);
