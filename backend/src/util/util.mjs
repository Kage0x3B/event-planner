import path from 'path';
import { DateTime } from 'luxon';

/**
 * Resolve an absolute path from the file calling the function to the relative filepath by
 * passing in the `import.meta.url`.
 *
 * @param importFilePath {string} pass `import.meta.url` to this parameter!
 * @param relativePath {string} the relative path to resolve
 * @return {string} the absolute path
 */
export function resolveRelativeFilePath (importFilePath, relativePath) {
  if (importFilePath.startsWith('file://')) {
    importFilePath = importFilePath.substring('file://'.length);
  }

  return path.join(importFilePath, relativePath);
}

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
 * @template T
 * @param {T} data
 * @param {keyof T} dateKeys
 * @return {T}
 */
export function fixSqlDates (data, ...dateKeys) {
  if (Array.isArray(data)) {
    return data.map(value => fixSqlDates(value, ...dateKeys));
  } else {
    for (const key of dateKeys) {
      if (typeof data[key] === 'number') {
        data[key] = DateTime.fromMillis(data[key]);
      } else if (typeof data[key] === 'string' && isoDateFormat.test(data[key])) {
        data[key] = DateTime.fromISO(data[key]);
      } else if (typeof data[key] === 'string' && sqlDateFormat.test(data[key])) {
        data[key] = DateTime.fromSQL(data[key]);
      }
    }

    return data;
  }
}

/**
 * @template T
 * @param {T[]} data
 * @param {keyof T} dateKeys
 * @return {T[]}
 */
export function fixSqlDatesArray (data, ...dateKeys) {
  return data.map(value => fixSqlDates(value, ...dateKeys));
}
