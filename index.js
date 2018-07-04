const BdsdClient = require('bdsd.client');
const Vorpal = require('vorpal');
const chalk = require('chalk');

const vorpal = Vorpal();

// add upport for color output
let colors = [];
for (let i = 0; i < 1000; i += 1) {
  colors.push('default');
}

const formatDate = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();
  milliseconds =
    parseInt(milliseconds) < 10 ? '0' + milliseconds : milliseconds;
  milliseconds =
    parseInt(milliseconds) < 100 ? '0' + milliseconds : milliseconds;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

const formatDatapointValue = data => {
  const strValue = `${formatDate(new Date())},    id: ${data.id}, value: ${
    data.value
  }, raw: [${data.raw.data}]`;

  // now color it
  const datapointColor = colors[data.id];
  if (datapointColor === 'default') {
    return strValue;
  }
  if (typeof chalk[datapointColor] === 'function') {
    return chalk[datapointColor](strValue);
  }

  return strValue;
};

const BdsdCli = function(params) {
  // connect to IPC
  let sockFile;
  if (typeof params.sockFile !== 'undefined') {
    sockFile = params.sockFile;
  }
  const myClient = BdsdClient(sockFile);
  // Register listener for broadcasted values
  myClient.on('value', data => {
    vorpal.log(formatDatapointValue(data));
  });

  // Listener for connected event.
  // Triggers when client connects and receive 'bus connected' notification
  myClient.on('connect', _ => {
    vorpal.log('connected');
    vorpal.delimiter('bobaos>').show();
  });

  vorpal
    .command('getDatapoints', 'Get all datapoint descriptions')
    .action(function(args, callback) {
      myClient
        .getDatapoints()
        .then(p => {
          p.forEach(t => {
            let str = `#${t.id}: length = ${t.length}, dpt = ${t.dpt},  prio: ${
              t.flags.priority
            }  flags: [${t.flags.communication ? 'C' : '-'}${
              t.flags.read ? 'R' : '-'
            }${t.flags.write ? 'W' : '-'}${t.flags.transmit ? 'T' : '-'}${
              t.flags.update ? 'U' : '-'
            }]`;
            this.log(str);
          });
        })
        .catch(e => {
          this.log(e.message);
        });
      callback();
    });

  vorpal
    .command('getDescription', 'Get datapoint description')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoint id');
        }
        let start = args.options.start;
        myClient
          .getDescription(start)
          .then(p => {
            this.log(p);
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command('getValue', 'Get datapoint value')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoint id');
        }
        let start = args.options.start;
        myClient
          .getValue(start)
          .then(p => {
            this.log(formatDatapointValue(p));
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command('readValue', 'Send read request to bus')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoint id');
        }
        let start = args.options.start;
        myClient
          .readValue(start)
          .then(p => {
            //this.log(p)
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command('setValue', 'Set datapoint value')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .option('-v, --value <value>', 'Required. Value of datapoint')
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoint id');
        }
        let start = args.options.start;
        if (typeof args.options.value === 'undefined') {
          throw new Error('Please specify datapoint value');
        }
        let value = args.options.value;
        myClient
          .setValue(start, value)
          .then(p => {
            //this.log(p)
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command('setProgrammingMode', 'Set programming mode')
    .option('-v, --value <value>', 'Required. Value')
    .action(function(args, callback) {
      try {
        let start = args.options.start;
        if (typeof args.options.value === 'undefined') {
          throw new Error('Please specify value');
        }
        let value = args.options.value;
        myClient
          .setProgrammingMode(value)
          .then(_ => {
            this.log(`Set programming mode: ${value}`);
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command('getStoredValue', 'Get stored datapoint value from bdsd.sock')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoint id');
        }
        let start = args.options.start;

        myClient
          .getStoredValue(start)
          .then(p => {
            this.log(formatDatapointValue(p));
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  // multiple values
  vorpal
    .command('readValues', 'Send read request to bus for multiple values')
    .option(
      '-s, --start <string>',
      'Required. Array of datapoints in string format. "1, 2, 3"'
    )
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify datapoints to read');
        }
        let start = args.options.start;
        let ids = start.split(',').map(t => parseInt(t));
        myClient
          .readValues(ids)
          .then(p => {
            //this.log(p);
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });

  vorpal
    .command(
      'setValues',
      'Send read request to bus for multiple numerical/bool values'
    )
    .option(
      '-s, --start <string>',
      'Required. Values in string format. "1:0, 2:0"'
    )
    .action(function(args, callback) {
      try {
        if (typeof args.options.start === 'undefined') {
          throw new Error('Please specify values to set');
        }
        let start = args.options.start;
        let values = start.split(',').map(t => {
          let data = t.split(':');
          return {id: parseInt(data[0]), value: parseFloat(data[1])};
        });
        myClient
          .setValues(values)
          .then(p => {
            //this.log(p);
          })
          .catch(e => {
            this.log(e.message);
          });
      } catch (e) {
        this.log(e.message);
      } finally {
        callback();
      }
    });
  vorpal
    .command('watch', 'Highlight datapoint in log')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .option('-c, --color <string>', 'Required. Color of output string')
    .action(function(args, callback) {
      let id = parseInt(args.options.start);
      let color = args.options.color;
      colors[id] = color;
      this.log('OK');
      callback();
    });
  vorpal
    .command('unwatch', 'Remove datapoint value hightlight')
    .option('-s, --start <number>', 'Required. Id of datapoint')
    .action(function(args, callback) {
      let id = parseInt(args.options.start);
      colors[id] = 'default';
      this.log('OK');
      callback();
    });

  return myClient;
};

module.exports = BdsdCli;
