'use strict';
var expect = require("chai").expect;

describe('matching', () => {
    it('should match template', () => {
        const template = { key: 'val'};
        const json = template;
        expect(check(template, json)).to.equal(true);
    });
    it('keys should match', () => {
        const template = { key: 'val'};
        const json = { key: 'lol'};
        expect(check(template, json)).to.equal(true);
    });
    it('json can have more data than template', () => {
        const template = { key: 'val'};
        const json = { key: 'lol', another_key:'some'};
        expect(check(template, json)).to.equal(true);
    });
    it('non-matching keys should fail', () => {
        const template = { key: 'val'};
        const json = { ke: 'lol'};
        expect(check(template, json)).to.equal(false);
    });
    it('order should not matter', () => {
        const template = { key: 'val', lol:'bal'};
        const json = { lol:'val', key: 'lol'};
        expect(check(template, json)).to.equal(true);
    });
    it('should check numbers', () => {
        const template = { key: 1};
        const json = { key: 2};
        expect(check(template, json)).to.equal(true);

        const json2 = { key: '2asd'};
        expect(check(template, json2)).to.equal(false);
    });
    it('should check array', () => {
        const template = { key: [1, 2, 3] };
        const json = { key: [5] };
        expect(check(template, json)).to.equal(true);

        const json2 = { key: 2 };
        expect(check(template, json2)).to.equal(false);
    });
    it('should check nested object structure', () => {
        const template = { key: { lol: 'bal'} };
        const json = { key: { lol: 'foo' } };
        expect(check(template, json)).to.equal(true);

        const json2 = { key: { bar: 'asd' } };
        expect(check(template, json2)).to.equal(false);
    });

});

const check = function check(template, json) {
    const isNumber = function isNumber(param) {
        return !isNaN(param);
    };

    let result = true;
    for (var prop in template) {
        if (template.hasOwnProperty(prop)) {
            if (!json.hasOwnProperty(prop)) {
                return result = false;
            }
            let templateProperty = template[prop];
            let jsonProperty = json[prop];
            if (isNumber(templateProperty)) {
                return (result = isNumber(jsonProperty));
            }
            if (Array.isArray(templateProperty)) {
                return Array.isArray(jsonProperty);
            }
            if (typeof templateProperty === 'object') {
                return check(templateProperty, jsonProperty);
            }
        }
    }

    return result;
};
