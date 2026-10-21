import assert from 'node:assert/strict';
import { test } from 'node:test';
import Type from '../src/type.js';
import { ContextError, DiagnosticError } from '../src/context-error.js';

test('Type match reports the outer failure and its original leaf diagnostic', () => {
    assert.throws(() => Type.matchType(String, 123), error => {
        assert.ok(error instanceof ContextError);
        assert.ok(error instanceof DiagnosticError);
        assert.equal(error.code, 'EL0130B');
        assert.equal(error.cause.code, 'EL01102');
        assert.match(error.cause.reason, /'string'.*number\(123\)/);
        assert.match(error.message, /^\[Stage 3\]\[EL0130B\]/);
        assert.match(error.message, /Caused by: \[Stage 3\]\[EL01102\]/);
        assert.doesNotMatch(error.message, /\$\d/);
        return true;
    });
});

test('nested Type property contexts survive each wrap', () => {
    assert.throws(() => Type.matchType({ user: { name: String } }, { user: { name: 1 } }), error => {
        assert.equal(error.code, 'EL0130B');
        assert.equal(error.path, "extType['user']['name']");
        assert.equal(error.cause.code, 'EL01143');
        let leaf = error;
        while (leaf.cause) leaf = leaf.cause;
        assert.equal(leaf.code, 'EL01102');
        assert.equal(leaf.prop['error path'], "extType['user']['name']");
        assert.match(error.message, /number\(1\)/);
        return true;
    });
});

test('Type allow retains codes and Type boolean APIs retain their results', () => {
    assert.throws(() => Type.allowType(String, Number), error => {
        assert.equal(error.code, 'EL0130A');
        assert.ok(error.cause instanceof ContextError);
        return true;
    });
    assert.equal(Type.isMatchType(String, 'ok'), true);
    assert.equal(Type.isMatchType(String, 1), false);
    assert.equal(Type.isAllowType(String, String), true);
    assert.equal(Type.isAllowType(String, Number), false);
    assert.equal(Type.isMatchType([[String, Number, Boolean, RegExp]], /a/), true);
    assert.equal(Type.matchType(String, 'ok'), undefined);
});
