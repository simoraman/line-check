'use strict';
var expect = require("chai").expect;
var check = require('../main');
describe('matching', () => {
    it('should match template', () => {
        const template = { key: 'val'};
        const json = template;

        const result = check(template, json);

        expect(result.match).to.equal(true);
    });
    it('keys should match', () => {
        const template = { key: 'val'};
        const json = { key: 'lol'};

        const result = check(template, json);

        expect(result.match).to.equal(true);
    });
    it('json can have more data than template', () => {
        const template = { key: 'val'};
        const json = { key: 'lol', another_key:'some'};

        const result = check(template, json);

        expect(result.match).to.equal(true);
    });
    it('non-matching keys should fail', () => {
        const template = { key: 'val'};
        const json = { ke: 'lol'};

        const result = check(template, json);

        expect(result.match).to.equal(false);
    });
    it('order should not matter', () => {
        const template = { key: 'val', lol:'bal'};
        const json = { lol:'val', key: 'lol'};

        const result = check(template, json);

        expect(result.match).to.equal(true);
    });
    it('should check numbers', () => {
        const template = { key: 1};
        const json = { key: 2};

        const result = check(template, json);

        expect(result.match).to.equal(true);

        const json2 = { key: '2asd'};
        expect(check(template, json2).match).to.equal(false);
    });
    it('should check array', () => {
        const template = { key: [1, 2, 3] };
        const json = { key: [5] };

        const result = check(template, json);

        expect(result.match).to.equal(true);

        const json2 = { key: 2 };
        expect(check(template, json2).match).to.equal(false);
    });
    it('should check nested object structure', () => {
        const template = { key: { lol: 'bal'} };
        const json = { key: { lol: 'foo' } };

        const result = check(template, json);

        expect(result.match).to.equal(true);

        const json2 = { key: { bar: 'asd' } };
        expect(check(template, json2).match).to.equal(false);
    });

});

describe('reporting', () => {
    it('should report missing field', () => {
        const template = { key: 'val', lol: 'bal' };
        const json = { key: 'val' };

        const result = check(template, json);

        expect(result.match).to.equal(false);
        expect(result.message).to.equal('missing key lol');
    });
    it('should report wrong data type(number)', () => {
        const template = { key: 1 };
        const json = { key: 'val' };

        const result = check(template, json);

        expect(result.match).to.equal(false);
        expect(result.message).to.equal('key key is not a number');
    });
    it('should report wrong data type(array)', () => {
        const template = { key: [] };
        const json = { key: 'val' };

        const result = check(template, json);

        expect(result.match).to.equal(false);
        expect(result.message).to.equal('key key is not an array');
    });
    it('should report wrong data type(object)', () => {
        const template = { key: { foo: 'bar'} };
        const json = { key: 'val' };

        const result = check(template, json);

        expect(result.match).to.equal(false);
        expect(result.message).to.equal('missing key foo');
    });
    it('should not report anything when ok', () => {
        const template = { key: 1 };
        const json = { key: 2 };

        const result = check(template, json);

        expect(result.match).to.equal(true);
        expect(result.message).to.equal('');
    });
});
