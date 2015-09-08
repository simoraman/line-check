'use strict';

const request = require('request-promise');
const check = require('./check');
const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const run = function run(opts) {
    return opts.map( (testCase) => {
        let templateP;
        if (testCase.templatePath) {
            templateP = fs
                .readFileAsync(testCase.templatePath, 'utf8')
                .then(file => { return JSON.parse(file); });
        } else {
            templateP = Promise.resolve(testCase.template);
        }
        const makeRequest = request(testCase.url);
        return Promise.join(templateP, makeRequest, (template, body) => {
            return check(template, JSON.parse(body));
        });
    });
};

module.exports = { run: run };
