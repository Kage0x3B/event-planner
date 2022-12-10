import path from 'path';

/**
 * Resolve an absolute path from the file calling the function to the relative filepath by
 * passing in the `import.meta.url`.
 *
 * @param importFilePath {string} pass `import.meta.url` to this parameter!
 * @param relativePath {string} the relative path to resolve
 * @return {string} the absolute path
 */
export function resolveRelativeFilePath(importFilePath, relativePath) {
    if (importFilePath.startsWith('file://')) {
        importFilePath = importFilePath.substring('file://'.length);
    }

    return path.join(importFilePath, relativePath);
}
