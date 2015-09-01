## Line Check
Library for checking that json from HTTP endpoint matches a given template.

## Requirements
Line check requires [io.js](https://iojs.org/en/) with `--harmony_arrow_functions`-flag.

## Installation
Installation is done with npm.
```
npm install line-check
```

## Usage
```javascript
    const options = [{ templatePath: './test/test-template.json',
                       url: 'http://localhost:9090/test-template.json'}];

    const result = lineCheck.run(options);

    Promise.all(result).then( (r) => {
        console.log(r.match);
        console.log(r.message);
    });
```

Run takes an array of objects with templatePath and url. It returns an array of promises. 

## License
MIT, see LICENSE file
