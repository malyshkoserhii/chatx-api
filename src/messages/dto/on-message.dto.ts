import { IsNumber } from 'class-validator';

export class OnMessagesDto {
	@IsNumber()
	recieverId: number;
	senderId: number;
	message: string;
}
