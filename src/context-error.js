/**** context-error.js | DiagnosticError, ContextError ****/

function _toText(value) {
    try {
        return String(value);
    } catch (error) {
        return '[unprintable value]';
    }
}

function _copyProp(prop) {
    const copy = {};
    if (prop === null || typeof prop !== 'object') return copy;

    Object.keys(prop).forEach(key => {
        Object.defineProperty(copy, key, {
            value: prop[key], enumerable: true, configurable: true, writable: true
        });
    });
    return copy;
}

function _replacePlaceholders(template, values) {
    const indexed = Array.isArray(values);
    const named = values !== null && typeof values === 'object' && !indexed;

    return _toText(template).replace(/\$\{(\w+)\}|\$(\d+)/g, (match, name, index) => {
        if (name !== undefined && !named) return match;
        if (index !== undefined && !indexed) return match;
        if (index !== undefined && Number(index) < 1) return match;

        const key = name !== undefined ? name : Number(index) - 1;
        if (!Object.prototype.hasOwnProperty.call(values, key) || values[key] === undefined) {
            return match;
        }
        return _toText(values[key]);
    });
}

/** Render one diagnostic; reason always takes precedence over rendered message. */
function formatDiagnostic({ code, reason, message, stage = 3, path, hint } = {}) {
    const identifier = code === undefined ? '' : `[${code}]`;
    const detail = reason === undefined ? message : reason;
    const location = path ? ` (${path})` : '';
    const suggestion = hint ? ` — ${hint}` : '';
    return `[Stage ${stage}]${identifier} ${_toText(detail)}${location}${suggestion}`;
}

function _formatFrame(error) {
    if (error !== null && typeof error === 'object' && typeof error.reason === 'string'
        && (error.stage === 1 || error.stage === 2 || error.stage === 3)) {
        const lines = [formatDiagnostic(error)];
        const prop = error.prop;
        if (prop !== null && typeof prop === 'object') {
            Object.keys(prop).forEach(key => {
                if (key !== 'error path' && typeof prop[key] === 'string') {
                    lines.push(`  ${key}: ${prop[key]}`);
                }
            });
        }
        return lines.join('\n');
    }
    if (error !== null && typeof error === 'object' && typeof error.message === 'string') {
        return `${error.name || 'Error'}: ${error.message}`;
    }
    return _toText(error);
}

function _buildFrames(error) {
    const frames = [];
    const seen = [];
    let current = error;

    while (current !== undefined && current !== null) {
        const isReference = typeof current === 'object' || typeof current === 'function';
        if (isReference && seen.indexOf(current) >= 0) {
            frames.push('[Circular cause]');
            break;
        }
        if (isReference) seen.push(current);
        frames.push(_formatFrame(current));
        current = isReference ? current.cause : undefined;
    }
    return frames;
}

function _captureStack(error, constructor) {
    if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(error, constructor);
        return;
    }

    const source = new Error(error.message);
    if (typeof source.stack === 'string') {
        const prefix = `Error: ${error.message}`;
        const stack = source.stack.indexOf(prefix) === 0
            ? `${error.name}: ${error.message}${source.stack.slice(prefix.length)}`
            : source.stack;
        Object.defineProperty(error, 'stack', {
            value: stack, configurable: true, writable: true
        });
    }
}

/**
 * Common diagnostic base. Prototype composition avoids native Error subclassing.
 * @param {string} code Stable diagnostic code
 * @param {string} reason Reason without diagnostic prefixes
 * @param {object} [options] stage, path, hint, cause and optional flat prop context
 */
function DiagnosticError(code, reason, options = {}) {
    const settings = options ?? {};
    this.name = new.target ? new.target.name : 'DiagnosticError';
    this.code = code;
    this.stage = settings.stage ?? 3;
    this.reason = _toText(reason);
    this.prop = _copyProp(settings.prop);

    const cause = settings.cause;
    const path = settings.path !== undefined ? settings.path
        : this.prop['error path'] !== undefined ? this.prop['error path']
            : cause !== null && cause !== undefined ? cause.path : undefined;
    if (path !== undefined) this.path = path;
    if (settings.hint !== undefined) this.hint = settings.hint;
    if (cause !== undefined) {
        Object.defineProperty(this, 'cause', {
            value: cause, configurable: true, writable: true
        });
    }
    Object.defineProperty(this, 'message', {
        value: formatDiagnostic(this), configurable: true, writable: true
    });
    _captureStack(this, new.target || DiagnosticError);
}

DiagnosticError.prototype = Object.create(Error.prototype, {
    constructor: { value: DiagnosticError, configurable: true, writable: true }
});
DiagnosticError._NS = 'Common';

/**
 * A diagnostic with positional/named templates and a rendered cause chain.
 * Catalogs belong to the calling module; this class never imports them.
 * @param {string} code Stable diagnostic code
 * @param {string} template Unformatted reason, with $1 or ${name} placeholders
 * @param {object} [options] values, stage, path, hint, cause and prop
 */
class ContextError extends DiagnosticError {
    constructor(code, template, options = {}) {
        const settings = options ?? {};
        super(code, _replacePlaceholders(template, settings.values), settings);

        const ownMessage = this.message;
        const frames = _buildFrames(this);
        this.message = frames.map((frame, index) => index === 0 ? frame : `Caused by: ${frame}`).join('\n');
        this.queue = frames.slice().reverse();

        // Engines without captureStackTrace keep a snapshot of the first header.
        if (typeof Error.captureStackTrace !== 'function' && typeof this.stack === 'string') {
            const prefix = `${this.name}: ${ownMessage}`;
            if (this.stack.indexOf(prefix) === 0) {
                this.stack = `${this.name}: ${this.message}${this.stack.slice(prefix.length)}`;
            }
        }
    }
}

ContextError._NS = 'Common';

// Name compatibility only; callers must migrate the old constructor arguments.
const ExtendError = ContextError;

export default ContextError;
export { ContextError, DiagnosticError, ExtendError, formatDiagnostic };
