/*
 * Created by Tommaso Latini <tommaso@domotz.com> on 11/09/15.
 *
 */

'use strict';

/**
 * const Heartbeat = require(“heartbeat”);
 * var hb = new Heartbeat(“21e8976c-c31f-2952-abf1-7ed4f2da3c76", “007007007007”, “DEADC0DEBEEF”);
 * hb.start();
 *
 * setInterval(function () {
 *      var status = hb.status();
 *      console.log('[%s] ID(%s) -> Status: %s. Host: %s. TTL: %s. Last Sent @ [%s] Code: %s.',
 *              status.time, status.id, status.status, status.host, status.ttl, status.last_sent, status.code);
 * }, 60 * 1000);
 */

const Heastbeat = require('./src/heartbeat');
module.exports = Heartbeat;