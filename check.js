'use strict';

const check = function check(template, json) {
    const isNumber = function isNumber(param) {
        return !isNaN(param);
    };

    const createResult = function createResult(result, message) {
        return { match: result, message: result ? '' : message };
    };
    let result = true;
    for (var prop in template) {
        if (template.hasOwnProperty(prop)) {
            if (!json.hasOwnProperty(prop)) {
                return createResult(false, `missing key ${prop}`);
            }
            let templateProperty = template[prop];
            let jsonProperty = json[prop];

            if (Array.isArray(templateProperty)) {
                return createResult(Array.isArray(jsonProperty),
                                    `key ${prop} is not an array`);
            }
            if (isNumber(templateProperty)) {
                return createResult(isNumber(jsonProperty),
                                    `key ${prop} is not a number`);
            }
            if (typeof templateProperty === 'object') {
                return check(templateProperty, jsonProperty);
            }
        }
    }

    return { match: result };
};

module.exports = check;
