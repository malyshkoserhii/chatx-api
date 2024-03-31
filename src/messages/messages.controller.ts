import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { GetMessagesDto } from './dto';

@Controller('messages')
export class MessagesController {
	constructor(private messagesService: MessagesService) {}

	@UseGuards(AtGuard)
	@Post('get')
	@HttpCode(HttpStatus.OK)
	getFriends(@Body() body: GetMessagesDto, @GetCurrentUserId() userId: number) {
		return this.messagesService.getMessages(body, userId);
	}
}
