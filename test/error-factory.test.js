import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import message from '../src/error-messages.js';
import * as internal from '../src/error-factory.js';
import { ContextError } from '../src/context-error.js';

test('error factory exposes only internal lookup and creation, without a Message class', () => {
    assert.deepEqual(Object.keys(internal).sort(), ['createError', 'getMessage']);
    assert.ok(Object.isFrozen(message));
    assert.equal(Object.prototype.hasOwnProperty.call(message, 'EN'), false);
    for (const template of Object.values(message)) {
        assert.equal(typeof template, 'string');
        assert.ok(template.length > 0);
        assert.doesNotMatch(template, /^-----/);
    }
});

test('catalog has no duplicate keys and covers every active Type error code', () => {
    const catalog = readFileSync(new URL('../src/error-messages.js', import.meta.url), 'utf8');
    const keys = Array.from(catalog.matchAll(/^\s*"([A-Z0-9]+)":/gm), match => match[1]);
    assert.equal(new Set(keys).size, keys.length);

    const source = readFileSync(new URL('../src/type.js', import.meta.url), 'utf8')
        .replace(/^\s*\/\/.*$/gm, '');
    const codes = Array.from(source.matchAll(/createError\('([A-Z0-9]+)'/g), match => match[1]);
    assert.ok(codes.length > 0);
    for (const code of codes) {
        assert.ok(Object.prototype.hasOwnProperty.call(message, code), `Missing catalog entry: ${code}`);
    }
});

test('unknown and inherited keys keep the requested code and use a safe fallback', () => {
    for (const code of ['E_MISSING', 'constructor', 'toString', '__proto__', 'hasOwnProperty']) {
        const error = internal.createError(code);
        assert.ok(error instanceof ContextError);
        assert.equal(error.code, code);
        assert.equal(error.reason, `No message is defined for code '${code}'.`);
    }
});

test('factory selects the template, substitutes values and preserves options without mutation', () => {
    const cause = new Error('source');
    const options = { path: 'sample', hint: 'Correct it.', cause };
    const error = internal.createError('EL01102', ['string', 'number'], options);
    assert.equal(error.code, 'EL01102');
    assert.equal(error.reason, "Type match : target is not type 'string'. tarType : number");
    assert.equal(error.path, 'sample');
    assert.equal(error.hint, 'Correct it.');
    assert.equal(error.cause, cause);
    assert.equal(Object.prototype.hasOwnProperty.call(options, 'values'), false);
});

test('locale environment does not affect messages or require async initialization', () => {
    const original = process.env.LANG;
    try {
        process.env.LANG = 'ko_KR.UTF-8';
        const koreanEnvironment = internal.createError('EL0130B').message;
        process.env.LANG = 'en_US.UTF-8';
        assert.equal(internal.createError('EL0130B').message, koreanEnvironment);
    } finally {
        if (original === undefined) delete process.env.LANG;
        else process.env.LANG = original;
    }
});
