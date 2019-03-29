/*
 * Created by Tommaso Latini <tommaso@domotz.com> on 11/09/15.
 */

'use strict';

const os = require('os');
const request = require('request-promise');

// Period
const PERIOD = 5 * 60 * 1000;

// Statuses
const OK = "OK";
const REROUTE = "REROUTE";
const FAIL = "FAIL";

function Heartbeat(server, key, mac, gateway, uuid, brand, model, platform) {

    var id = null;
    var ttl = 0;
    var reason = "";
    var registerUrl = buildUrl(server);
    var geoHbUrl = null;
    var url = null;
    var osName = os.platform();
    var osVersion = os.release();
    var headers = {
        'User-Agent': "fing-hb-node",
        'X-API-Key': key
    };
    var body = {
        device: {
            mac: mac,
            gatewaymac: gateway
        }
    };
    var result = "UNKNOWN";
    var last;

    if (uuid)
        body.device['uuid'] = uuid;
    if (brand)
        body.device['brand'] = brand;
    if (model)
        body.device['model'] = model;
    if (platform)
        body.device['hw-platform'] = platform;
    if (osName)
        body.device['os-name'] = osName;
    if (osVersion)
        body.device['os-ver'] = osVersion;


    function buildUrl(host) {
        return "https://" + host + "/2/heartbeat";
    }

    function heartbeat() {

        url = ttl == 0 ? registerUrl : geoHbUrl;

        return request({
            url: url,
            method: "POST",
            headers: headers,
            json: body
        })
        .then(handleResponse)
        .catch(handleError);
    }

    function handleResponse(body) {

        last = new Date();
        result = body['result'];

        // console.log("[%s] Sent request to '%s' => %s", last.toISOString(), url, result);

        if (result == REROUTE) {
            geoHbUrl = buildUrl(body['reroute-host']);
            ttl = body['host-ttl-on-error'];
            reason = "ok";
            // Sent immediately
            heartbeat();
        } else if (result == OK) {
            // Update TTL
            ttl = body['host-ttl-on-error'];
            reason = "ok";
        } else if (result == FAIL) {
            handleError(body['error-descr']);
        } else {
            handleError("Unknown");
        }
    }

    function handleError(err) {
        result = FAIL; // Use fail also for other error
        ttl -= ttl > 0 ? 1 : 0;
        reason = err;
        // console.error("Error: %s. TTL: %s", error, ttl);
    }

    /**
     * Post Condition:
     *
     *    heartbeat service started
     *    id == Timeout Object
     */
    function start() {

        if (id > 0) {
            // Already started
            return;
        }

        heartbeat();

        id = setInterval(heartbeat, PERIOD);
    }

    function status() {
        var ret = {};

        ret.status = (id != null) ? "RUNNING" : "READY";
        ret.registerUrl = registerUrl;
        ret.geoUrl = geoHbUrl;
        ret.ttl = ttl;
        ret.code = result;
        ret.reason = reason;
        ret.last_sent = last;
        ret.last_url = url;

        return ret;
    }

    /**
     * Post Condition:
     *
     *    heartbeat service stopped
     *    id == null
     */
    function stop() {
        if (id != null) {
            clearInterval(id);
        }
        id = null;
    }

    this.start = start;
    this.status = status;
    this.stop = stop;

}

module.exports = Heartbeat;
