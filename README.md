# bdsd-cli

Commad-line interface for Bobaos Datapoint Sdk.

## Installation

First, you need to install and run as a service [bdsd.sock](https://github.com/shabunin/bdsd.sock)

If it is already done, proceed to next steps:

```sh
$ sudo npm install -g bdsd-cli
```
## Usage

1. Start the application

```sh
$ bdsd-cli
connected
bobaos> 
```

2. Get command list

```sh
bobaos> help
  Commands:

      help [command...]          Provides help for a given command.
      exit                       Exits application.
      getDatapoints              Get all datapoint descriptions
      getDescription [options]   Get datapoint description
      getValue [options]         Get datapoint value
      readValue [options]        Send read request to bus
      setValue [options]         Set datapoint value
```

3. Try commands:

```sh
bobaos> setProgrammingMode -v 1
Set programming mode: success
bobaos> setProgrammingMode -v 0
Set programming mode: success 
bobaos> getDatapoints
[ { id: 1,
    length: 2,
    flags:
    { priority: 'low',
      communication: true,
      read: true,
      write: true,
      readOnInit: false,
      transmit: true,
      update: false },
      dpt: 'dpt9' },
  { id: 2,
    length: 1,
    flags:
    { priority: 'low',
      communication: true,
      read: false,
      write: true,
      readOnInit: false,
      transmit: true,
      update: false },
      dpt: 'dpt5' } ]
bobaos> getValue -s 1
{ id: 1, value: 19 }
bobaos> setValue -s 2 -v 0
{ id: 2 }
bobaos> readValue -s 1
{ id: 1 }
bobaos> getDescription -s 1
{ id: 1,
  value:
  { id: 1,
    dpt: 'dpt9',
    flags:
    { priority: 'low',
      communication: true,
      read: true,
      write: true,
      readOnInit: false,
      transmit: true,
      update: false },
      length: 2 } }
```

