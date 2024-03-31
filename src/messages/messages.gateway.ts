import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnMessagesDto } from './dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({
	cors: ['http://localhost:3000'],
})
export class MessagesGateway implements OnModuleInit {
	constructor(private messagesService: MessagesService) {}

	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log(socket.id);
			console.log('Connected!');
		});
	}

	@SubscribeMessage('newMessage')
	async conNewMessage(client: Socket, data: OnMessagesDto) {
		console.log('data: ', data);

		await this.messagesService.createMessage(data);

		this.server.emit('onMessage', {
			newMessage: 'New Message',
			content: data,
		});

		const event = 'events';
		return { event, data };
	}
}
