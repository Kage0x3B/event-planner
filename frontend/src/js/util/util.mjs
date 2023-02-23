import { DateTime } from 'luxon';

export const isoDateFormat = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/;
export const sqlDateFormat = /^\d{4}-[01]\d-[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d$/;

/**
 * Converts all dates and values matching the iso date format in an object to luxon DateTime instances
 *
 * @param {Record<string, any> | Record<string, any>[]} obj
 * @return {Record<string, *>|Record<string, *>|Record<string, *>[]}
 */
export function convertToDateTime (obj) {
  if (typeof obj === 'undefined' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = convertToDateTime(obj[i]);
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Date) {
        obj[key] = DateTime.fromJSDate(obj[key]);
      } else if (typeof obj[key] === 'object') {
        convertToDateTime(obj[key]);
      } else if (typeof obj[key] === 'string' && isoDateFormat.test(obj[key])) {
        obj[key] = DateTime.fromISO(obj[key]);
      } else if (typeof obj[key] === 'string' && sqlDateFormat.test(obj[key])) {
        obj[key] = DateTime.fromSQL(obj[key]);
      }
    }
  }

  return obj;
}

/**
 * Create a function which debounces calls to the input function by a certain timeout
 *
 * @template {ArgsType}
 * @param {(...args: ArgsType) => void} func
 * @param {number} timeout
 * @return {(...args: ArgsType) => void}
 */
export function debounce (func, timeout) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}
