import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/common/guards';
import { FollowsService } from './follows.service';
import { DeclineFollowerDto, InviteFriendDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('follows')
export class FollowsController {
	constructor(private followsService: FollowsService) {}

	@UseGuards(AtGuard)
	@Post('invite-friend')
	@HttpCode(HttpStatus.OK)
	inviteFriend(@Body() body: InviteFriendDto, @GetCurrentUserId() userId: number) {
		return this.followsService.inviteFriend(body, userId);
	}

	@UseGuards(AtGuard)
	@Get('my-followers')
	@HttpCode(HttpStatus.OK)
	getMyFollowers(@GetCurrentUserId() userId: number) {
		return this.followsService.getMyFollowers(userId);
	}

	@UseGuards(AtGuard)
	@Get('my-followings')
	@HttpCode(HttpStatus.OK)
	getMyFollowings(@GetCurrentUserId() userId: number) {
		return this.followsService.getMyFollowings(userId);
	}

	@UseGuards(AtGuard)
	@Post('cancel-invitation')
	@HttpCode(HttpStatus.OK)
	cancelInvitation(@Body() body: DeclineFollowerDto, @GetCurrentUserId() userId: number) {
		return this.followsService.cancelInvitation(body, userId);
	}

	@UseGuards(AtGuard)
	@Post('decline-invitation')
	@HttpCode(HttpStatus.OK)
	declineInvitation(@Body() body: DeclineFollowerDto, @GetCurrentUserId() userId: number) {
		return this.followsService.declineInvitation(body, userId);
	}
}
