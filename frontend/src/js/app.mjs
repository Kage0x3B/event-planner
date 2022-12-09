import { Router } from './Router.mjs';

const router = new Router();
router.initializeRouting().catch(err => {
    console.error('Failed to initialize routing', err);
});