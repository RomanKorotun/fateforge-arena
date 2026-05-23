import { SessionEntity } from '../../domain/entities/session.entity';

export const GetUserSessionsResponseMapper = {
  toResponseList(sessions: SessionEntity[], currentSessionId: string) {
    console.log(sessions);
    return sessions.map((s) =>
      GetUserSessionsResponseMapper.toResponse(s, currentSessionId),
    );
  },

  toResponse(session: SessionEntity, currentSessionId: string) {
    return {
      sessionId: session.sessionId,
      ip: session.ip,
      device: session.device,
       geo: session.geo,
      createdAt: session.createdAt,
      isCurrent: session.sessionId === currentSessionId,
    };
  },
};
