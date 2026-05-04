export const SESSION_TTL_SECONDS = parseInt(
  process.env.ACCESS_TOKEN_TIME ?? '604800',
  10,
);
