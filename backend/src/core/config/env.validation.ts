import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_TIME: Joi.number().required(),
  REDIS_USE_TLS_AUTH: Joi.boolean().required(),
  REDIS_URL_AUTH: Joi.string().required(),
  ADMIN_USERNAME: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  BACKEND_URL: Joi.string().required(),
});
