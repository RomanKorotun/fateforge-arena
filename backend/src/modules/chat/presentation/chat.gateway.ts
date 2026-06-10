import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { WsJwtGuard } from '../../auth/presentation/guards/ws-jwt.guard';

import { ChatRedisRepository } from '../infrastructure/redis/chat.repository';
import { JoinRoomUseCase } from '../application/use-cases/join-room.usecase';
import { LeaveRoomUseCase } from '../application/use-cases/leave-room.usecase';
import { SendMessageUseCase } from '../application/use-cases/send-message.usecase';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatRepositoty: ChatRedisRepository,
    private readonly joinRoom: JoinRoomUseCase,
    private readonly leaveRoom: LeaveRoomUseCase,
    private readonly sendMessage: SendMessageUseCase,
  ) {}

  // CONNECT
  async handleConnection(client: Socket) {
    console.log('Client connected - chat', client.id);
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
    console.log('Client disconnected - chat', client.id);
  }
}
