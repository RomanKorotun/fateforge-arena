export interface SessionEntity {
  sessionId: string;
  userId: string;
  ip: string;
  device: {
    browser: string;
    os: string;
    type: string;
  };
  createdAt: string;
}
