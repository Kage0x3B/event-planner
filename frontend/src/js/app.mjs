import { Router } from './Router.mjs';

Router.getInstance().initializeRouting().catch(err => {
  console.error('Failed to initialize routing', err);
});
