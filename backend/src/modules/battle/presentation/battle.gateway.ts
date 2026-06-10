import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JoinOnlineUseCase } from '../application/arena/join-online/join-online.use-case';
import { LeaveOnlineUseCase } from '../application/arena/leave-online/leave-online.use-case';
import { CreateDuelUseCase } from '../application/duel/create-duel.use-case';
import { AcceptDuelUseCase } from '../application/duel/accept-duel.use-case';
import { GetPendingDuelsUseCase } from '../application/duel/get-pending-duels.use-case';
import { MakeMoveUseCase } from '../application/battle/make-move.use-case';
import { GetMyActiveBattleUseCase } from '../application/battle/get-my-active-battle.use-case';
import { Zone } from '../domain/enums/zone.enum';
import { WsJwtGuard } from '../../auth/presentation/guards/ws-jwt.guard';
import { GetOnlineUsersUseCase } from '../application/arena/get-online-users/get-online-users.use-case';
import { GetActiveBattlesUseCase } from '../application/battle/get-active-battles.usecase';
import { BattleTickService } from '../application/services/battle-tick.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'battle',
  cors: { origin: '*' },
})
export class BattleGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly tick: BattleTickService,

    private readonly joinOnlineUseCase: JoinOnlineUseCase,
    private readonly leaveOnlineUseCase: LeaveOnlineUseCase,
    private readonly getOnlineUsersUseCase: GetOnlineUsersUseCase,

    private readonly createDuelUseCase: CreateDuelUseCase,
    private readonly acceptDuelUseCase: AcceptDuelUseCase,
    private readonly getPendingDuelsUseCase: GetPendingDuelsUseCase,

    private readonly getActiveBattlesUseCase: GetActiveBattlesUseCase,
    private readonly makeMove: MakeMoveUseCase,
    private readonly getMyActiveBattleUseCase: GetMyActiveBattleUseCase,
  ) {}

  // CONNECT
  async handleConnection(client: Socket) {
    console.log('Client connected - battle', client.id);
  }

  // користувач доєднується до онлайна
  @SubscribeMessage('online:join')
  async joinOnlineHandler(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (!user) return;
    await this.joinOnlineUseCase.execute({
      id: user.id,
      username: user.username,
    });
    const users = await this.getOnlineUsersUseCase.execute();
    this.server.emit('online:updated', users);
  }

  // користувач виходить із онлайна
  @SubscribeMessage('online:leave')
  async leaveOnlineHandler(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (!user) return;
    await this.leaveOnlineUseCase.execute(user.id);
    const users = await this.getOnlineUsersUseCase.execute();
    this.server.emit('online:updated', users);
  }

  // заявка на створення дуелі
  @SubscribeMessage('duel:create')
  async createDuelHandler(@ConnectedSocket() client: Socket) {
    const user = client.data.user;
    if (!user) return;
    try {
      const duel = await this.createDuelUseCase.execute(user.id, user.username);
      this.server.emit('duel:created', duel);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Помилка при створенні дуелі';
      client.emit('duel:create:error', { message });
    }
  }

  // отримати всі pending заявки (дуелі)
  @SubscribeMessage('duel:get-pending')
  async getPendingHandler(@ConnectedSocket() client: Socket) {
    const duels = await this.getPendingDuelsUseCase.execute();
    client.emit('duel:list', duels);
  }

  // отриматти всі активні батли
  @SubscribeMessage('battle:get-active')
  async getActive(@ConnectedSocket() client: Socket) {
    const battles = await this.getActiveBattlesUseCase.execute();
    client.emit('battle:list', battles);
  }

  // користувач приймає виклик на дуель
  @SubscribeMessage('duel:accept')
  async acceptHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { duelId: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    try {
      const { duel, battle } = await this.acceptDuelUseCase.execute(
        data.duelId,
        user.id,
      );

      // видалили дуель
      this.server.emit('duel:removed', duel.id);

      // створили battle
      this.server.emit('battle:created', battle);

      // створити socket room тільки для 2 гравців
      const roomId = `battle:${battle.id}`;
      const sockets = await this.server.fetchSockets();

      for (const socket of sockets) {
        const u = socket.data.user;
        if (!u) continue;

        if (u.id === battle.player1Id || u.id === battle.player2Id) {
          socket.join(roomId);
        }
      }

      // ТІЛЬКИ УЧАСНИКАМ — старт матчу
      this.server.to(roomId).emit('battle:started', battle);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Помилка при прийнятті дуелі';
      client.emit('duel:accept:error', { message });
    }
  }

  // отримати поточний стан батла для учасників
  @SubscribeMessage('battle:get-my-active')
  async statusHandler(@ConnectedSocket() client: Socket) {
    const user = client.data.user;

    if (!user) return;

    const battle = await this.getMyActiveBattleUseCase.execute(user.id);

    if (battle) {
      client.join(`battle:${battle.id}`);
    }

    client.emit('battle:my-active', battle);
  }

  // один хід в кімнаті (дуель)
  @SubscribeMessage('battle:move')
  async moveHandler(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      attackZone: Zone;
      defenseZone: Zone;
    },
  ) {
    const user = client.data.user;
    if (!user) return;

    const room = await this.makeMove.execute({
      ...data,
      userId: user.id,
    });

    this.server.to(`battle:${data.roomId}`).emit('battle:updated', room);
  }

  // DISCONNECT
  async handleDisconnect(client: Socket) {
    console.log('Client disconnected - battle', client.id);
  }

  afterInit(server: Server) {
    this.tick.setServer(server);
  }
}
