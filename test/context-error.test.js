import assert from 'node:assert/strict';
import vm from 'node:vm';
import { test } from 'node:test';
import ContextError, { DiagnosticError, ExtendError, formatDiagnostic } from '../src/context-error.js';

test('DiagnosticError keeps one standard diagnostic and the original cause', () => {
    const cause = new TypeError('source failure');
    const error = new DiagnosticError('E_SAMPLE', 'Invalid sample.', {
        path: 'sample.value', hint: 'Use a string.', cause
    });

    assert.ok(error instanceof Error);
    assert.ok(error instanceof DiagnosticError);
    assert.equal(error.name, 'DiagnosticError');
    assert.equal(error.code, 'E_SAMPLE');
    assert.equal(error.stage, 3);
    assert.equal(error.reason, 'Invalid sample.');
    assert.equal(error.message, '[Stage 3][E_SAMPLE] Invalid sample. (sample.value) — Use a string.');
    assert.equal(error.cause, cause);
    assert.equal(Object.getOwnPropertyDescriptor(error, 'cause').enumerable, false);
    assert.equal(Object.getOwnPropertyDescriptor(error, 'message').enumerable, false);
    assert.match(error.stack, /^DiagnosticError: \[Stage 3\]\[E_SAMPLE\]/);
});

test('ContextError implements the common hierarchy and the old export is a name alias', () => {
    const error = new ContextError('E_SAMPLE', 'Invalid $1.', { values: ['sample'] });
    assert.equal(ExtendError, ContextError);
    assert.ok(error instanceof Error);
    assert.ok(error instanceof DiagnosticError);
    assert.ok(error instanceof ExtendError);
    assert.equal(error.name, 'ContextError');
    assert.equal(error.reason, 'Invalid sample.');
    assert.equal(error.toString(), `ContextError: ${error.message}`);
    assert.equal(formatDiagnostic(error), '[Stage 3][E_SAMPLE] Invalid sample.');
});

test('positional substitution handles $10, falsy values and missing tokens in one pass', () => {
    const values = ['$2', false, 0, '', null, undefined, 'g', 'h', 'i', 'ten'];
    values[-1] = 'invalid';
    const error = new ContextError('E_VALUES', '$1|$2|$3|$4|$5|$6|$10|$11|$0|${name}', { values });
    assert.equal(error.reason, '$2|false|0||null|$6|ten|$11|$0|${name}');
});

test('named substitution accepts null-prototype and special own keys', () => {
    const values = Object.create(null);
    values.name = '$1';
    values.hasOwnProperty = 'own';
    values.__proto__ = 'literal';
    const error = new ContextError('E_NAMED', '${name}|${hasOwnProperty}|${__proto__}|${missing}|$1', { values });
    assert.equal(error.reason, '$1|own|literal|${missing}|$1');
});

test('substitution ignores inherited values and tolerates null or omitted values', () => {
    const values = Object.create({ name: 'inherited' });
    assert.equal(new ContextError('E_NAMED', '${name}', { values }).reason, '${name}');
    assert.equal(new ContextError('E_NULL', '$1 ${name}', { values: null }).reason, '$1 ${name}');
    assert.equal(new ContextError('E_NONE', '$1 ${name}').reason, '$1 ${name}');
    assert.equal(new ContextError('E_OPTIONS', 'reason', null).reason, 'reason');

    const inherited = [];
    Object.setPrototypeOf(inherited, { 0: 'inherited' });
    assert.equal(new ContextError('E_INDEXED', '$1', { values: inherited }).reason, '$1');
});

test('an unprintable substitution does not hide an existing cause', () => {
    const cause = new Error('original');
    const value = { toString() { throw new Error('conversion'); } };
    const error = new ContextError('E_VALUE', 'Value: $1', { values: [value], cause });
    assert.equal(error.reason, 'Value: [unprintable value]');
    assert.equal(error.cause, cause);
    assert.match(error.message, /Caused by: Error: original$/);
});

test('nested contexts render each reason once, outermost first, without changing causes', () => {
    const native = new TypeError('invalid source');
    const nativeStack = native.stack;
    const leaf = new DiagnosticError('E_LEAF', 'Invalid field.', { path: 'user.name', cause: native });
    const middle = new ContextError('E_MIDDLE', 'Check user.', { cause: leaf });
    const outer = new ContextError('E_OUTER', 'Save failed.', { cause: middle });

    assert.equal(outer.message, [
        '[Stage 3][E_OUTER] Save failed. (user.name)',
        'Caused by: [Stage 3][E_MIDDLE] Check user. (user.name)',
        'Caused by: [Stage 3][E_LEAF] Invalid field. (user.name)',
        'Caused by: TypeError: invalid source'
    ].join('\n'));
    assert.equal(outer.reason, 'Save failed.');
    assert.equal(outer.cause, middle);
    assert.equal(middle.cause, leaf);
    assert.equal(leaf.cause, native);
    assert.equal(native.stack, nativeStack);
    assert.equal(outer.path, 'user.name');
    assert.match(outer.stack, /^ContextError: \[Stage 3\]\[E_OUTER\]/);
});

test('wrapping one cause into separate branches does not share queues or context', () => {
    const prop = { 'error path': 'item.name', style: 'required' };
    const base = new ContextError('E_BASE', 'Base.', { prop });
    const originalMessage = base.message;
    const left = new ContextError('E_LEFT', 'Left.', { cause: base });
    const right = new ContextError('E_RIGHT', 'Right.', { cause: base });

    prop.style = 'changed';
    left.queue.push('mutated');
    left.prop.local = 'left';
    assert.equal(base.prop.style, 'required');
    assert.equal(base.message, originalMessage);
    assert.equal(base.queue.length, 1);
    assert.equal(right.queue.length, 2);
    assert.match(right.queue[0], /\[E_BASE\]/);
    assert.match(right.queue[1], /\[E_RIGHT\]/);
    assert.doesNotMatch(right.message, /E_LEFT|mutated|changed/);
    assert.notEqual(left.queue, base.queue);
    assert.notEqual(right.prop, base.prop);
    assert.match(right.message, /style: required/);
});

test('context copying preserves special own properties without prototype mutation', () => {
    const prop = JSON.parse('{"__proto__":"literal","constructor":"text","error path":"item"}');
    const error = new ContextError('E_PROP', 'Invalid.', { prop });
    assert.equal(Object.getPrototypeOf(error.prop), Object.prototype);
    assert.equal(Object.prototype.hasOwnProperty.call(error.prop, '__proto__'), true);
    assert.equal(error.prop.__proto__, 'literal');
    assert.equal(error.prop.constructor, 'text');
    assert.equal(error.path, 'item');
});

test('explicit path overrides inherited context and reason formatting preserves stage and hint', () => {
    const cause = new DiagnosticError('W_LEAF', 'Leaf.', { stage: 2, path: 'old' });
    const error = new ContextError('E_OUTER', 'Outer.', {
        path: 'new', hint: 'Correct it.', cause, prop: { 'error path': 'prop' }
    });
    assert.equal(error.path, 'new');
    assert.match(error.message, /^\[Stage 3\]\[E_OUTER\] Outer\. \(new\) — Correct it\./);
    assert.match(error.message, /Caused by: \[Stage 2\]\[W_LEAF\] Leaf\. \(old\)$/);
});

test('structural diagnostics from another realm are rendered without parsing message', () => {
    const cause = vm.runInNewContext('({code: "E_FOREIGN", stage: 3, reason: "Foreign.", message: "already rendered", path: "foreign"})');
    const error = new ContextError('E_LOCAL', 'Local.', { cause });
    assert.equal(error.cause, cause);
    assert.match(error.message, /Caused by: \[Stage 3\]\[E_FOREIGN\] Foreign\. \(foreign\)$/);
    assert.doesNotMatch(error.message, /already rendered/);
});

test('cyclic causes terminate and distinct equal reasons remain separate nodes', () => {
    const cyclic = new Error('cycle');
    cyclic.cause = cyclic;
    const error = new ContextError('E_OUTER', 'Outer.', { cause: cyclic });
    assert.match(error.message, /Caused by: \[Circular cause\]$/);
    const inner = new ContextError('E_SAME', 'Same.');
    const outer = new ContextError('E_SAME', 'Same.', { cause: inner });
    assert.equal(outer.message.match(/\[E_SAME\]/g).length, 2);
});

test('module-specific classes inherit diagnostic fields and error identity', () => {
    class ModuleError extends ContextError {}
    class ModuleDiagnostic extends DiagnosticError {}
    const cause = new ModuleDiagnostic('E_MODULE', 'Failure.');
    const error = new ModuleError('E_OUTER', 'Module $1.', { values: ['failed'], cause });
    assert.ok(error instanceof ModuleError);
    assert.ok(error instanceof ContextError);
    assert.ok(error instanceof DiagnosticError);
    assert.ok(error instanceof Error);
    assert.equal(error.name, 'ModuleError');
    assert.equal(error.reason, 'Module failed.');
    assert.equal(error.cause, cause);
    assert.equal(cause.name, 'ModuleDiagnostic');
    assert.match(error.stack, /^ModuleError:/);
});

test('fallback stack capture works without Error.captureStackTrace', () => {
    const original = Error.captureStackTrace;
    try {
        Error.captureStackTrace = undefined;
        const cause = new Error('source');
        const error = new ContextError('E_FALLBACK', 'Fallback.', { cause });
        assert.ok(error instanceof Error);
        assert.match(error.stack, /^ContextError: \[Stage 3\]\[E_FALLBACK\] Fallback\./);
        assert.equal(error.stack.match(/Caused by: Error: source/g).length, 1);
    } finally {
        Error.captureStackTrace = original;
    }
});
