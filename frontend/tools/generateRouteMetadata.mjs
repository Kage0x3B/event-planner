import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const GENERATED_FILES_FOLDER = path.join(process.cwd(), './src/generated');
const GENERATED_FILE_PATH = path.join(GENERATED_FILES_FOLDER, './routeMetadata.generated.mjs');
const ROUTE_CLASS_EXPORT_REGEX = /export\s+default\s+class\s+\w+Route\s+extends\s+AbstractRoute/;
const ROUTE_PATH_VALIDATION_REGEX = /^(((\/([a-zA-Z0-9_-]+)|\/(:[a-z][a-zA-Z0-9_-]*))*)|\/)$/;
let routeIdCounter = 1;

function findRouteFiles (folderPath) {
  const routeFiles = [];

  const files = fs.readdirSync(folderPath, {
    withFileTypes: true
  });

  for (const file of files) {
    if (file.isDirectory()) {
      routeFiles.push(...findRouteFiles(path.join(folderPath, file.name)));
    } else if (file.isFile() && (file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.ejs'))) {
      routeFiles.push(path.join(folderPath, file.name));
    }
  }

  return routeFiles;
}

function normalizeRoutePath (routePath, isEjsTemplate) {
  routePath = routePath.substring(0, routePath.length - (isEjsTemplate ? '.ejs'.length : '.html'.length));

  if (routePath.endsWith('index')) {
    routePath = routePath.substring(0, routePath.length - '/index'.length);
  }

  routePath = '/' + routePath;

  return routePath;
}

/**
 * @param {string} routeFilePath
 * @return {Promise<import('../src/types/Route').GeneratorRouteMetadata>}
 */
async function loadRouteMetadata (routeFilePath) {
  const parsedPath = path.parse(routeFilePath);
  const routeId = parsedPath.name + routeIdCounter++;

  const isEjsTemplate = routeFilePath.toLowerCase().endsWith('.ejs');

  const routeContent = fs.readFileSync(routeFilePath, 'utf-8');
  const routeClassFilePath = routeFilePath.substring(0, routeFilePath.length - (isEjsTemplate ? 4 : 5)) + '.mjs';
  const relativeRouteClassFilePath = path.relative(GENERATED_FILES_FOLDER, routeClassFilePath);
  const routeClassExists = fs.existsSync(routeClassFilePath);

  if (routeClassExists) {
    const routeClassJs = fs.readFileSync(routeClassFilePath, 'utf-8');

    if (!ROUTE_CLASS_EXPORT_REGEX.test(routeClassJs)) {
      throw new Error(`Invalid route class file "${routeFilePath}", no valid default-exported class extending AbstractRoute found`);
    }
  }

  const routePath = normalizeRoutePath(path.relative(path.join(process.cwd(), 'src/routes'), routeFilePath), isEjsTemplate);

  if (!ROUTE_PATH_VALIDATION_REGEX.test(routePath)) {
    throw new Error(`Invalid route path "${routePath}", can only contain paths with [a-zA-Z0-9_-] or camel-cased page parameter names, starting with ":"`);
  }

  return {
    id: routeId,
    path: routePath,
    routeClassFilePath: routeClassExists ? relativeRouteClassFilePath : undefined,
    html: isEjsTemplate ? ejs.compile(routeContent, {
      client: true,
      async: false,
      strict: true,
      destructuredLocals: ['data', 'params', 'query']
    }) : '`' + routeContent + '`'
  };
}

/**
 * @param {import('../src/types/Route').GeneratorRouteMetadata} routeData
 * @return {string}
 */
function stringifyRouteMetadata (routeData) {
  const { pathRegexString, pageParameterNames } = buildPathRegex(routeData.path);

  return `{
        id: '${routeData.id}',
        pathRegex: /${pathRegexString}/,
        pageParameterNames: [${pageParameterNames.map(p => `'${p}'`).join(', ')}],
        routeInstance: ${routeData.routeClassFilePath ? `new (await import('${routeData.routeClassFilePath}')).default()` : 'undefined'},
        html: ${routeData.html}
    }`;
}

/**
 * Build a regex to match the route
 * @param routePath {string}
 * @return {{pathRegexString: string; pageParameterNames: string[]}}
 */
function buildPathRegex (routePath) {
  let pathRegex = '^';
  const pageParameterNames = [];

  for (const pathPart of routePath.split('/')) {
    if (!pathPart) {
      continue;
    }

    pathRegex += '\\/';

    if (pathPart.startsWith(':')) {
      const parameterName = pathPart.substring(1);
      pageParameterNames.push(parameterName);

      pathRegex += `([^/]+)`;
    } else {
      pathRegex += `${pathPart}`;
    }
  }

  if (pathRegex.length === 1) {
    pathRegex += '\\/';
  }

  pathRegex += '$';

  return {
    pathRegexString: pathRegex,
    pageParameterNames
  };
}

async function generateRoutingMetadata () {
  console.info('Generating routing metadata...');

  const routeFolder = path.join(process.cwd(), './src/routes');

  const routeFiles = findRouteFiles(routeFolder);
  console.info(`Found ${routeFiles.length} routes`);

  const routeEntryStrings = (await Promise.all(routeFiles.map(loadRouteMetadata))).map(stringifyRouteMetadata);
  const generatedRouteMetadata = `import { DateTime } from 'luxon';\n/** @return {Promise<(import('../../types/Route').RouteMetadata)[]>} */\nexport async function loadRouteMetadata() {\nreturn [\n${routeEntryStrings.join(',\n')}];\n}`;

  const generatedJsFolder = fs.existsSync(GENERATED_FILES_FOLDER);

  if (!generatedJsFolder) {
    fs.mkdirSync(GENERATED_FILES_FOLDER, { recursive: true });
  }

  fs.writeFileSync(GENERATED_FILE_PATH, generatedRouteMetadata);
}

generateRoutingMetadata().catch(err => {
  console.error('Couldn\'t generate routing metadata', err);
});
