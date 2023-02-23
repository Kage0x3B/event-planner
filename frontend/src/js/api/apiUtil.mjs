import { API_BASE_URL } from '../config.mjs';
import { convertToDateTime } from '../util/util.mjs';
import { NetworkRequestError } from '../util/NetworkRequestError.mjs';

/**
 *
 * @param {Response} response
 * @return {Promise<any>}
 */
async function parseResponse (response) {
  if (!response.ok) {
    throw new NetworkRequestError(response);
  }

  // If the response is intentionally empty
  if (response.status === 204) {
    return undefined;
  }

  const responseData = await response.json();
  return convertToDateTime(responseData);
}

/**
 * @param {string} path
 * @param {Partial<RequestInfo>} options
 * @return {Promise<any>}
 */
export async function get (path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    ...options
  });

  return await parseResponse(response);
}

/**
 * @param {string} path
 * @param {unknown} data
 * @param {Partial<RequestInfo>} options
 * @return {Promise<any>}
 */
export async function post (path, data, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*;q=0.8',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    ...options
  });

  return await parseResponse(response);
}

/**
 * @param {string} path
 * @param {Partial<RequestInfo>} options
 * @return {Promise<any>}
 */
export async function del (path, options = {}) {
  const response = await fetch(API_BASE_URL + path, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    },
    ...options
  });

  return await parseResponse(response);
}
