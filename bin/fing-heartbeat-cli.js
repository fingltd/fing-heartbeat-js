#!/usr/bin/env node

/**
 * Created by Tommaso Latini <tommaso@fing.com> on 19/12/15
 */

'use strict';

var Heartbeat = require("../src/heartbeat");

var root = require('root-require');
var argparse = require('argparse');
var macaddress = require('macaddress');
var pkg = root('package.json');
var name = pkg.name;
var version = pkg.version;

var hb = null;

function parseMac(mac) {
    return mac.replace(":","").toUpperCase();
}

function log(status) {
    console.log("+ ---------------------------------------------- +");
    console.log('| Servers => { Register: %s, Geo: %s}', status.registerUrl, status.geoUrl);
    console.log('| Last Sent @ [%s] to %s', status.last_sent.toISOString(), status.last_url);
    console.log('| %s | TTL: %s. Status = %d [%s]', status.status, status.ttl,status.code, status.reason);
    console.log("+ ---------------------------------------------- +");
}

function run(args) {

    hb = new Heartbeat(
        args.heartbeat_server,
        args.api_key,
        parseMac(args.mac),
        parseMac(args.gateway_mac),
        args.uuid,
        args.brand,
        args.model,
        args.platform
    );

    hb.start();

    var last_log = 0;

    setInterval(function () {
        var status = hb.status();
        last_log = Date.now();
        if (last_log < status.last_sent) {

        }
    }, args.log_status_every * 1000);
}

process.on('SIGINT', function() {
    if (hb != null) {
        var status = hb.status();
        console.log("Stopping %s [%s] ...", name, version);
        hb.stop();
    }
    process.exit();
});


// Create Parser
var parser = new argparse.ArgumentParser({
    version: version,
    addHelp: true,
    description: 'Fing Heartbeat CLI'
});

// Add arguments

//   *) Mandatory
parser.addArgument(['-s', '--heartbeat_server'], {
    help: "Heartebeat Server"
});
parser.addArgument(['-k', '--api_key'], {
    help: "Api Key to access to Fing API"
});
parser.addArgument(['-a', '--mac'], {
    help: "MAC address of device."
});
parser.addArgument(['-g', '--gateway_mac'], {
    help: "MAC address of network gateway. If in a router, same as mac."
});

//   *) Optional
parser.addArgument(['-u', '--uuid'], {
    help: "Unique ID of the device, if available. E.g. serial number.",
    defaultValue: null
});
parser.addArgument(['-b', '--brand'], {
    help: "Brand name.",
    defaultValue: null
});
parser.addArgument(['-m', '--model'], {
    help: "Model of the device.",
    defaultValue: null
});
parser.addArgument(['-p', '--platform'], {
    help: "Hardware platform of the device.",
    defaultValue: null
});
parser.addArgument(['-l', '--log_status_every'], {
    help: "Print status every LOG_STATUS_EVERY seconds",
    defaultValue: null
});

// Parse CLI options and set properly the environment variables
var args = parser.parseArgs();

// Check mandatory arguments
if (!args.heartbeat_server) {
   throw new Error("Missing Heartbeat Server");
}
if (!args.api_key) {
    throw new Error("Missing Api Key for Authentication");
}
if (!args.gateway_mac) {
    throw new Error("Missing Mac Address of Gateway");
}

console.log("+------------------------------------------------+");
console.log("     _____ _");
console.log("    |  ___(_)_ __   __ _");
console.log("    | |_  | | '_ \\ / _` |");
console.log("    |  _| | | | | | (_| |");
console.log("    |_|   |_|_| |_|\\__, |");
console.log("                   |___/");
console.log("              HEARTBEAT COMMAND LINE");
console.log("+------------------------------------------------+");
console.log("Starting %s [%s] ...", name, version);
console.log("");


if (!args.mac) {
    macaddress.one(function(err, mac) {

        if (err) {
            throw new Error("Unable to get MAC adddress: " + err);
        }
        args.mac = mac;
        run(args);
    });

} else {

    run(args);

}



