import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { RateLimitService } from '../../../shared/infrastructure/rate-limit/rate-limit.service';

import { WsRateLimitGuard } from '../../../common/guards/ws-rate-limit.guard';
import { RateLimit } from '../../../common/decorators/rate-limit.decorator';

import { corsConfig } from '../../../core/config/runtime/cors.config';

import { WsJwtGuard } from '../../auth/presentation/guards/ws-jwt.guard';

import { ChatRedisRepository } from '../infrastructure/redis/chat.repository';

import { JoinRoomUseCase } from '../application/use-cases/join-room.usecase';
import { LeaveRoomUseCase } from '../application/use-cases/leave-room.usecase';
import { SendMessageUseCase } from '../application/use-cases/send-message.usecase';

import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(WsJwtGuard, WsRateLimitGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: corsConfig,
})
export class ChatGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatRepositoty: ChatRedisRepository,
    private readonly rateLimitService: RateLimitService,
    private readonly joinRoom: JoinRoomUseCase,
    private readonly leaveRoom: LeaveRoomUseCase,
    private readonly sendMessage: SendMessageUseCase,
  ) {}

  // CONNECT
  async handleConnection(client: Socket) {
    const namespace = client.nsp.name;
    const allowed = await this.rateLimitService.check(
      `ratelimit:ws:connection:${namespace}:${client.handshake.address}`,
      60,
      60,
    );

    if (!allowed) {
      this.logger.warn(`WS connection blocked ${namespace} ${client.handshake.address}`);
      client.disconnect(true);
      return;
    }

    this.logger.log(`Client connected - ${namespace} ${client.id}`);
  }

  // Приєднання користувача до кімнати
  @SubscribeMessage('room:join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinRoomDto,
  ) {
    const user = client.data.user;

    if (!user) return;

    const room = dto.room;

    client.join(room);

    await this.joinRoom.execute(room, user);

    const users = await this.chatRepositoty.getUsers(room);

    this.server.to(room).emit('room:users', users);

    const messages = await this.chatRepositoty.getLastMessages(room);
    client.emit('chat:init', messages);
  }

  // Вихід користувача з кімнати
  @SubscribeMessage('room:leave')
  async leave(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: LeaveRoomDto,
  ) {
    const user = client.data.user;
    if (!user) return;

    const room = dto.room;

    client.leave(room);

    await this.leaveRoom.execute(room, user.id);

    const users = await this.chatRepositoty.getUsers(room);
    this.server.to(room).emit('room:users', users);
  }

  // Повідомоення від користувача
  @RateLimit(40, 60)
  @SubscribeMessage('message:send')
  async send(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const user = client.data.user;
    if (!user) return;

    const message = await this.sendMessage.execute(user, dto.room, dto.content);

    this.server.to(dto.room).emit('message:new', message);
  }

  // DISCONNECT
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected - chat: ${client.id}`);
  }
}
