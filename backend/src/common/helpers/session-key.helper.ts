export const buildSessionKey = (sessionId: string): string =>
  `session:${sessionId}`;

export const buildUserSessionsKey = (userId: string): string =>
  `userSessions:${userId}`;
