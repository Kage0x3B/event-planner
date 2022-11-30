import fs from 'fs';
import path from 'path';

const GENERATED_FILES_FOLDER = path.join(process.cwd(), './src/js/generated');
const GENERATED_FILE_PATH = path.join(GENERATED_FILES_FOLDER, './routeMetadata.js');
const ROUTE_CLASS_EXPORT_REGEX = /export default class \w+Route extends AbstractRoute/;
let routeIdCounter = 1;

function findRouteFiles(folderPath) {
    const routeFiles = [];

    const files = fs.readdirSync(folderPath, {
        withFileTypes: true
    });

    for (const file of files) {
        if (file.isDirectory()) {
            routeFiles.push(...findRouteFiles(path.join(folderPath, file.name)));
        } else if (file.isFile() && file.name.toLowerCase().endsWith('.html')) {
            routeFiles.push(path.join(folderPath, file.name));
        }
    }

    return routeFiles;
}

/**
 * @param {string} routeFilePath
 * @return {import('../src/types/Route').GeneratorRouteMetadata}
 */
function loadRouteMetadata(routeFilePath) {
    const parsedPath = path.parse(routeFilePath);
    const routeId = parsedPath.name + routeIdCounter++;

    const routeHtml = fs.readFileSync(routeFilePath, 'utf-8');
    const routeClassFilePath = routeFilePath.substring(0, routeFilePath.length - 5) + '.js';
    const relativeRouteClassFilePath = path.relative(GENERATED_FILES_FOLDER, routeClassFilePath);
    const routeClassExists = fs.existsSync(routeClassFilePath);

    if (routeClassExists) {
        const routeClassJs = fs.readFileSync(routeClassFilePath, 'utf-8');

        console.log(routeClassJs);
        if (!ROUTE_CLASS_EXPORT_REGEX.test(routeClassJs)) {
            throw new Error(`Invalid route class file "${routeFilePath}", no valid default-exported class extending AbstractRoute found`);
        }
    }

    return {
        id: routeId,
        html: routeHtml,
        routeClassFilePath: routeClassExists ? relativeRouteClassFilePath : undefined
    };
}

/**
 * @param {import('../src/types/Route').GeneratorRouteMetadata} routeData
 * @return {string}
 */
async function stringifyRouteMetadata(routeData) {
    return `{
        id: "${routeData.id}",
        routeInstance: new (await import('${routeData.routeClassFilePath}')).default,
        html: \`${routeData.html}\`
    }`;
}

async function generateRoutingMetadata() {
    console.info('Generating routing metadata...');

    const routeFolder = path.join(process.cwd(), './src/routes');

    const routeFiles = findRouteFiles(routeFolder);
    console.info(`Found ${routeFiles.length} routes`);

    const routeEntryStrings = await Promise.all(routeFiles.map(loadRouteMetadata).map(stringifyRouteMetadata));
    const generatedRouteMetadata = `export const routeMetadata = [\n${routeEntryStrings.join(',\n')}\]`;
    fs.writeFileSync(GENERATED_FILE_PATH, generatedRouteMetadata);
}

generateRoutingMetadata();