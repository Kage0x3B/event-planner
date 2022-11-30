import { Router } from './Router';

const router = new Router();
router.initializeRouting().catch(err => {
    console.error('Failed to initialize routing', err);
});