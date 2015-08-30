'use strict';
const expect = require("chai").expect;
const check = require('../check');
const run = require('../run');
const Promise = require('bluebird');

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

describe('Runner', () => {
    var nock = require('nock');

    beforeEach( () => {
        const server = nock('http://localhost:9090')
                  .get('/test-template.json')
                  .reply('200', { "key": 1 })
                  .get('/test-template2.json')
                  .reply('200', { "wrong-key": 1 });
    });

    it('should get json from endpoint and template from file', (done) => {
        const options = [{ templatePath: './test/test-template.json',
                         url: 'http://localhost:9090/test-template.json'}];
        const result = run(options)[0].then(
                           function(result) {
                               expect(result.match).to.equal(true);
                               done();
                           });
    });

    it('should return array of results', (done) => {
        const options = [{ templatePath: './test/test-template.json',
                           url: 'http://localhost:9090/test-template.json'}];

        options.push({ templatePath: './test/test-template.json',
                       url: 'http://localhost:9090/test-template2.json'});

        const result = run(options);

        Promise.all(result).then( (r) => {
            expect(r[0].match).to.equal(true);
            expect(r[1].match).to.equal(false);
            done();
        });
    });
});
