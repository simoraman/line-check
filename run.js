'use strict';

const request = require('request-promise');
const check = require('./check');
const Promise = require("bluebird");
const fs = require('fs');
Promise.promisifyAll(fs);

const run = function run(opts, cb) {
    const readFile = fs.readFileAsync(opts[0].templatePath, 'utf8');
    const makeRequest = request(opts[0].url);
    Promise.join(readFile, makeRequest, (file, body) => {
        cb(check(JSON.parse(file), JSON.parse(body)));
    });
};

module.exports = run;
