/**
 * @typedef {100 | 101  | 102  | 103 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511} HttpStatusCode
 *
 * @typedef {{
 *   statusCode: number;
 *   message: string;
 *   stack? : string;
 *   cause? : Error;
 * }} ErrorResponse
 */

import config from '../config.mjs';

export default class RestError extends Error {
  /**
   * @param {string} message
   * @param {HttpStatusCode} statusCode
   * @param {Error | undefined} cause
   */
  constructor (
    message,
    statusCode = 500,
    cause = undefined
  ) {
    super(message);

    this.statusCode = statusCode;
    this.cause = cause;

    Error.captureStackTrace(this, RestError);
  }

  /**
   * @returns {ErrorResponse}
   */
  toJSON () {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      stack: config.DEVELOPMENT ? this.stack : undefined,
      cause: config.DEVELOPMENT ? this.cause : undefined
    };
  }
}

export class BadRequestError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Bad request', cause = undefined) {
    super(message, 400, cause);
  }
}

export class ValidationError extends RestError {
  /**
   * @param {import('yup').ValidationError} validationError
   */
  constructor (validationError) {
    super('Validation error', 400, validationError);

    this.validationErrors = validationError.errors;
  }
}

export class MissingPathParameterError extends RestError {
  /**
   * @param {string} parameterName
   * @param {Error | undefined} cause
   */
  constructor (parameterName, cause = undefined) {
    super(`Request path parameter ${parameterName} is required`, 400, cause);
  }
}

export class UnauthorizedError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Unauthorized', cause = undefined) {
    super(message, 401, cause);
  }
}

export class ForbiddenError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Forbidden', cause = undefined) {
    super(message, 403, cause);
  }
}

export class NotFoundError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Not found', cause = undefined) {
    super(message, 404, cause);
  }
}

export class PreconditionFailedError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Precondition failed', cause = undefined) {
    super(message, 412, cause);
  }
}

export class InternalServerError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Internal server error', cause = undefined) {
    super(message, 500, cause);
  }
}

export class NotImplementedError extends RestError {
  /**
   * @param {string | undefined} message
   * @param {Error | undefined} cause
   */
  constructor (message = 'Not implemented', cause = undefined) {
    super(message, 501, cause);
  }
}
