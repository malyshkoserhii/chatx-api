import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMessagesDto } from './dto';
import { OnMessagesDto } from './dto';

@Injectable()
export class MessagesService {
	constructor(private prismaService: PrismaService) {}

	async getMessages(body: GetMessagesDto, userId: number) {
		console.log('BODY: ', body);
		console.log('userId: ', userId);
		const messages = await this.prismaService.message.findMany({
			where: {
				senderId: userId,
				recieverId: body.friendId,
				// OR: {
				// 	senderId: body.friendId,
				// 	recieverId: userId,
				// },
			},
		});

		return messages;
	}

	async createMessage(body: OnMessagesDto) {
		console.log('BODY: ', body);
		try {
			await this.prismaService.message.create({
				data: {
					senderId: body.senderId,
					recieverId: body.recieverId,
					message: body.message,
				},
			});
		} catch (error) {
			console.log('ERROR: ', error);
		}
	}
}
