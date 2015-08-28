'use strict';

var check = require('./check');

const run = function run(fileName, url, cb) {
    const fs = require('fs');
    const request = require('request');

    const template = fs.readFileSync(fileName, 'utf8');

    request(url, (_, response, body) => {
        cb(check(JSON.parse(template), JSON.parse(body)));
    });
};

module.exports = run;
