export class NetworkRequestError extends Error {
  /**
   * @param {Response} response
   */
  constructor (
    response
  ) {
    super('Network request failed');

    this.response = response;
    this.statusCode = response.status;

    Error.captureStackTrace(this, NetworkRequestError);
  }
}
