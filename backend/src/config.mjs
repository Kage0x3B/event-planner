export default {
  HOST: process.env.HTTP_HOST ?? '0.0.0.0',
  PORT: process.env.HTTP_PORT ?? 8080,
  DEVELOPMENT: process.env.NODE_ENV !== 'production'
};
