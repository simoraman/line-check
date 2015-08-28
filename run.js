'use strict';

const request = require('request-promise');
const check = require('./check');
const Promise = require("bluebird");
const fs = require('fs');
Promise.promisifyAll(fs);

const run = function run(fileName, url, cb) {
    const readFile = fs.readFileAsync(fileName, 'utf8');
    const makeRequest = request(url);
    Promise.join(readFile, makeRequest, (file, body) => {
        cb(check(JSON.parse(file), JSON.parse(body)));
    });
};

module.exports = run;
