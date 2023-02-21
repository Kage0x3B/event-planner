import autoBind from 'auto-bind';
import { InternalServerError, ValidationError } from '../util/RestError.mjs';
import config from '../config.mjs';
import { convertToDateTime } from '../util/util.mjs';

export class AbstractController {
  constructor () {
    autoBind(this);
  }

  /**
   * @return {import('express').Router}
   */
  getRouter () {
    /*
     * hacky way to make an abstract method because normal Javascript doesn't support abstract methods
     */
    throw new Error('Method getRouter not implemented');
  }

  /**
   * Return the path prefix this controller should be registered at.
   * Notice that the paths of all api controllers start with `/api`.
   *
   * @return {string}
   */
  getPath () {
    throw new Error('Method getPath not implemented');
  }

  /**
   *
   * @param {function(req: import('express').Request): any} handler
   * @param {{allowEmptyResponse?: boolean; bodyValidationSchema?: (import('yup').Schema | undefined)}}  if not set, undefined responses are errors and return a 500 error
   * @return {import('express').RequestHandler}
   */
  wrap (handler, { allowEmptyResponse, bodyValidationSchema } = {
    allowEmptyResponse: false,
    bodyValidationSchema: undefined
  }) {
    /**
     * @type {function (req: import('express').Request, res: import('express').Response): any}
     */
    const wrappedHandler = (req, res) => {
      try {
        if (bodyValidationSchema) {
          try {
            req.body = bodyValidationSchema.validateSync(req.body, {
              stripUnknown: true,
              abortEarly: false
            });
          } catch (err) {
            throw new ValidationError(err);
          }
        }

        req.body = convertToDateTime(req.body);

        const responseData = handler(req);

        if (!responseData && !allowEmptyResponse) {
          throw new InternalServerError('Unexpected empty response');
        }

        res.status(responseData ? 200 : 204).json(responseData);
      } catch (err) {
        const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;

        if (config.DEVELOPMENT || statusCode >= 500) {
          console.error(statusCode >= 500 ? 'Unexpected error while serving request' : 'Error while serving request', err);
        }

        if (Object.hasOwn(err, 'toJSON')) {
          res.status(statusCode).json(err.toJSON());
        } else {
          res.status(statusCode).json({
            ...(config.DEVELOPMENT ? err : {}),
            statusCode,
            message: typeof err.message === 'string' ? err.message : 'Internal Server Error'
          });
        }
      }
    };

    return wrappedHandler;
  }
}
