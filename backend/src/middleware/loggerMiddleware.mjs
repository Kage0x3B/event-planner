import morgan from 'morgan';
import { logger } from '../util/logger.mjs';

const SKIPPED_ROUTES = [];

export const loggerMiddleware = morgan('dev', {
    stream: {
        write: (str) => {
            if (str.endsWith('\n')) {
                str = str.substring(0, str.length - 1);
            }

            logger.info(str);
        }
    },
    skip: (req) => {
        for (const skippedRoute of SKIPPED_ROUTES) {
            if (req.path.toLowerCase().startsWith(skippedRoute)) {
                return true;
            }
        }

        return false;
    }
});
