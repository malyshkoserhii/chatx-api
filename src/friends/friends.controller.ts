import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';
import { DeleteFriendDto } from './dto';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	@UseGuards(AtGuard)
	@Post('add-friend')
	@HttpCode(HttpStatus.OK)
	addFriend(@Body() body: AddFriendDto, @GetCurrentUserId() userId: number) {
		return this.friendsService.addFriend(body, userId);
	}

	@UseGuards(AtGuard)
	@Get('my-friends')
	@HttpCode(HttpStatus.OK)
	getFriends(@GetCurrentUserId() userId: number) {
		return this.friendsService.getFriends(userId);
	}

	@UseGuards(AtGuard)
	@Post('delete-friend')
	@HttpCode(HttpStatus.OK)
	deleteFriend(@Body() body: DeleteFriendDto, @GetCurrentUserId() userId: number) {
		return this.friendsService.deleteFriend(body, userId);
	}
}
