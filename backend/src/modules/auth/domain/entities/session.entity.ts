export interface SessionEntity {
  sessionId: string;
  userId: string;
  ip: string;
  device: {
    browser: string;
    os: string;
    type: string;
  };
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
  };
  createdAt: string;
}
