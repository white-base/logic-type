/**** error-factory.js | Internal message lookup and error creation ****/
import message from './error-messages.js';
import { ContextError } from './context-error.js';

/** Look up a template without reading inherited object properties. */
function getMessage(code) {
    if (Object.prototype.hasOwnProperty.call(message, code)) return message[code];
    return `No message is defined for code '${code}'.`;
}

/**
 * Create this module's error; do not re-export from the package public entrypoint.
 * @param {string} code Message code owned by this module
 * @param {Array|object} [values] Positional or named placeholder values
 * @param {object} [options] stage, path, hint, cause and optional prop context
 * @returns {ContextError}
 */
function createError(code, values = [], options = {}) {
    return new ContextError(code, getMessage(code), { ...options, values });
}

export { createError, getMessage };
