const BdsdClient = require('bdsd.client');
const Vorpal = require('vorpal');

// BdsdClient function accepts socket filename as an argument.
// If no argument provided then it will try to connect to following file:
// process.env['XDG_RUNTIME_DIR'] + '/bdsd.sock'. Usually it is /run/user/1000/bdsd.sock.
// TODO: socket file name from args
let myClient = BdsdClient();
const vorpal = Vorpal();

// Register listener for broadcasted values
myClient.on('value', data => {
  //console.log('broadcasted value', data);
});

// Listener for connected event.
// Triggers when client connects and receive 'bus connected' notification
myClient.on('connect', _ => {
  console.log('connected');
  vorpal
    .delimiter('bobaos>')
    .show();
});

vorpal
  .command('getDatapoints', 'Get all datapoint descriptions')
  .action(function (args, callback) {
    myClient
      .getDatapoints()
      .then(console.log)
      .catch(console.log);
    setTimeout(callback, 250);
  });

vorpal
  .command('getDescription', 'Get datapoint description')
  .option('-s, --start <number>', 'Required. Id of datapoint')
  .action(function (args, callback) {
    try {
      if (typeof args.options.start === 'undefined') {
        throw new Error('Please specify datapoint id');
      }
      let start = args.options.start;

      //app.getDatapointDescription(start, number);
      myClient
        .getDescription(start)
        .then(console.log)
        .catch(console.log);
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(callback, 250);
    }
  });

vorpal
  .command('getValue', 'Get datapoint value')
  .option('-s, --start <number>', 'Required. Id of datapoint')
  .action(function (args, callback) {
    try {
      if (typeof args.options.start === 'undefined') {
        throw new Error('Please specify datapoint id');
      }
      let start = args.options.start;

      //app.getDatapointDescription(start, number);
      myClient
        .getValue(start)
        .then(console.log)
        .catch(console.log);
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(callback, 250);
    }
  });

vorpal
  .command('readValue', 'Send read request to bus')
  .option('-s, --start <number>', 'Required. Id of datapoint')
  .action(function (args, callback) {
    try {
      if (typeof args.options.start === 'undefined') {
        throw new Error('Please specify datapoint id');
      }
      let start = args.options.start;

      //app.getDatapointDescription(start, number);
      myClient
        .readValue(start)
        .then(console.log)
        .catch(console.log);
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(callback, 250);
    }
  });

vorpal
  .command('setValue', 'Set datapoint value')
  .option('-s, --start <number>', 'Required. Id of datapoint')
  .option('-v, --value <value>', 'Required. Value of datapoint')
  .action(function (args, callback) {
    try {
      if (typeof args.options.start === 'undefined') {
        throw new Error('Please specify datapoint id');
      }
      let start = args.options.start;
      if (typeof args.options.value === 'undefined') {
        throw new Error('Please specify datapoint value');
      }
      let value = args.options.value;
      //app.getDatapointDescription(start, number);
      myClient
        .setValue(start, value)
        .then(console.log)
        .catch(console.log);
    } catch (e) {
      console.log(e)
    } finally {
      setTimeout(callback, 250);
    }
  });
