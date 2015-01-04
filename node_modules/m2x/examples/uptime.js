#!/usr/bin/env node

//
// See https://github.com/attm2x/m2x-nodejs/blob/master/README.md#example-usage
// for instructions
//

var config = require("./config");
var M2X = require("m2x");
var UptimeDataSource = require("./uptime_data_source");
var source = new UptimeDataSource();
var m2xClient = new M2X(config.api_key);

// Create the streams if they don't exist already
source.update(function(data) {
    m2xClient.devices.updateStream(config.device, "load_1m", { value: data.load_1m });
    m2xClient.devices.updateStream(config.device, "load_5m", { value: data.load_5m });
    m2xClient.devices.updateStream(config.device, "load_15m", { value: data.load_15m });
});

// Retrieve values each 1000ms and post them to the device
source.updateEvery(1000, function(data, stopLoop) {
    var at = new Date().toISOString();
    var values = {
        load_1m:  [ { value: data.load_1m, timestamp: at } ],
        load_5m:  [ { value: data.load_5m, timestamp: at } ],
        load_15m: [ { value: data.load_15m, timestamp: at } ]
    };

    // Write the different values into AT&T M2X
    m2xClient.devices.postMultiple(config.device, values, function(result) {
        console.log(result);
        if (result.isError()) {
            // Stop the update loop if an error occurs.
            stopLoop();

            console.log(result.error());
        }
    });
});

