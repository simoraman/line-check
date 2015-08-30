'use strict';

const request = require('request-promise');
const check = require('./check');
const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const run = function run(opts, cb) {
    return opts.map( (testCase) => {
        const readFile = fs.readFileAsync(testCase.templatePath, 'utf8');
        const makeRequest = request(testCase.url);
        return Promise.join(readFile, makeRequest, (file, body) => {
            return check(JSON.parse(file), JSON.parse(body));
        });
    });
};

module.exports = run;
