import { API_BASE_URL } from '../config.mjs';
import { convertToDateTime } from '../util/util.mjs';

/**
 * @param {string} path
 * @param {Partial<RequestInfo>} options
 * @return {Promise<any>}
 */
export async function get (path, options = {}) {
  console.info('Fetching', API_BASE_URL + path);
  const response = await fetch(API_BASE_URL + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    ...options
  });

  const responseData = await response.json();
  return convertToDateTime(responseData);
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
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    ...options
  });

  const responseData = await response.json();
  return convertToDateTime(responseData);
}
