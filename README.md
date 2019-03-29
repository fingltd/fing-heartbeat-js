# README #

A node.js package with a usable client for Fing Heartbeat infrastructure.
The package comes with a Command Line Interface that might help in 
the configuration.

### Modifications ###

* Server and ApiKey as external input
* CLI to provide examples of usages

### Installation ###

```
npm install fing-heartbeat
fing-heartbeat-cli --help
```

### Usage ###

* Setup

```
var Heartbeat = require(“fing-heartbeat”);

const server = "hb.example.com";
const api_key = "2664a5e44f0f13400f261b41b7ccabaa";

const checkPeriod = 10 * 60 * 1000;

var hb = new Heartbeat(, “007007007007”, “DEADC0DEBEEF”);

hb.start();

setInterval(function () {
  var status = hb.status();
}, checkPeriod);

```

| # | Parameter           | Mandatory | Description                                                  |
| - | ------------------- | --------- | ------------------------------------------------------------ |
| 1 | server              |    YES    | Host Name of server implementing Fing Heartbeat Protocol     |
| 2 | apiKey              |    YES    | Api Key (required for authentication)                        |
| 3 | macAddress          |    YES    | MAC address of device                                        |
| 4 | gwMacAddress        |    YES    | MAC address of network gateway. If in a router, same as mac. |
| 5 | uuid                |    NO     | Unique ID of the device, if available. E.g. serial number.   |
| 6 | brand               |    NO     | Brand name                                                   |
| 7 | model               |    NO     | Model of the device                                          |
| 8 | hwPlatform          |    NO     | Hardware platform of the device                              |

* Teardown

```
hb.stop();
```

### License ###

(c) 2016-2019 Fing LTD, MIT license.

### Author ###

Tommaso Latini <tommaso at fing.com>

