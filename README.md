# README #

A node.js package with a usable client for Fing Heartbeat infrastructure.
The package comes with a Command Line Interface that might help in 
the configuration.

### Installation ###

```
npm install fing-heartbeat
fing-heartbeat-cli --help
```

### Usage ###

* Setup

```
var Heartbeat = require(“fing-heartbeat”);

var server = "hb.example.com";
var api_key = "2664a5e44f0f13400f261b41b7ccabaa";
var mac = "00:70:07:00:70:07";
var gatewayMac = "DE:AD:C0:DE:BE:EF"
 
var checkPeriod = 10 * 60 * 1000;

var hb = new Heartbeat(server, api_key, mac, gatewayMac);

hb.start();

setInterval(function () {
  var status = hb.status();
  console.log(status);
}, checkPeriod);

```

* Teardown

```
hb.stop();
```

### Parameters ###

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

### Modifications ###

* v1.0.3
    * Compatibility since node v0.10
* v1.0.2
    * Fix README w/ per-version modifications
* v1.0.1
    * Server and ApiKey as external input
* v1.0.0
    * Heartbeat client
    * CLI to provide examples of usages

### License ###

(c) 2016-2019 Fing LTD, MIT license.

### Author ###

Tommaso Latini <tommaso at fing.com>

