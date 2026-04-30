import { SessionEntity } from '../../domain/entities/session.entity';

export const GetUserSessionsResponseMapper = {
  toResponseList(sessions: SessionEntity[], currentSessionId: string) {
    return sessions.map((s) => this.toResponse(s, currentSessionId));
  },

  toResponse(session: SessionEntity, currentSessionId: string) {
    return {
      sessionId: session.sessionId,
      ip: session.ip,
      device: session.device,
      createdAt: session.createdAt,
      isCurrent: session.sessionId === currentSessionId,
    };
  },
};
