## Line Check
Line Check is a library for checking that json from HTTP endpoint matches a given template.

## Motivation
It is a common pattern to run front end or front end tests against static json-files instead of live back end. This causes a risk that front end and back end fall out of sync. Line Check is a tool that helps to detect this.

## Requirements
Line check requires [io.js](https://iojs.org/en/) with `--harmony_arrow_functions`-flag.

## Installation
Installation is done with npm.
```
npm install line-check
```

## Usage
```javascript
    const lineCheck = require('line-check');
    const Promise = require('bluebird');
    const options = [{ templatePath: './test/test-template.json',
                       url: 'http://localhost:9090/test-template.json'}];

    const result = lineCheck.run(options);

    Promise.all(result).then( (r) => {
        console.log(r.match); // boolean
        console.log(r.message); // string 
    });
```

Run takes an array of objects with templatePath and url. Alternative to templatePath is template, which is a plain javascript object. `run` returns an array of promises that resolve to a result object. Result object has boolean `match` field stating whether template and json match or not. If match is false `message` field will report part that does not match. 

## License
MIT, see LICENSE file
