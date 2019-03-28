#!/usr/bin/env node

/**
 * Created by Tommaso Latini <tommaso@fing.com> on 19/12/15
 */

'use strict';

const Heartbeat = require("../src/heartbeat");

const root = require('root-require');
const argparse = require('argparse');
const macaddress = require('macaddress');
const pkg = root('package.json');
const name = pkg.name;
const version = pkg.version;

var hb = null;

function parseMac(mac) {
    return mac.replace(":","").toUpperCase();
}

function log(status) {
    console.log('[%s] Status: %s. Register: %s. GeoServer: %s. TTL: %s. Last Sent @ [%s] Code: %s (%s)',
        status.time, status.status, status.registerUrl, status.geoUrl ,status.ttl, status.last_sent, status.reason, status.code);
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

    setInterval(function () {
        var status = hb.status();
        log(status);
    }, args.log_status_every * 1000);
}

process.on('SIGINT', function() {
    if (hb != null) {
        var status = hb.status();
        log(status);
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

// Mandatory
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

// Optional
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
    help: "Print status every STATUSE_EVERY seconds",
    defaultValue: null
});




// Parse CLI options and set properly the environment variables
var args = parser.parseArgs();

// Check mandatory arguments
if (!args.heartbeat_server) {
   throw new Error("Missing Heartbeat Server");
}
if (!args.api_key) {
    throw new Error("Missing Mac Address");
}
if (!args.gateway_mac) {
    throw new Error("Missing Mac Address");
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
console.log("[%s] Start %s [%s]", new Date(), name, version);


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



