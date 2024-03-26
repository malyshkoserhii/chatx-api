import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@UseGuards(AtGuard)
	@Get('me')
	@HttpCode(HttpStatus.OK)
	getUser(@GetCurrentUserId() userId: number) {
		return this.userService.getUser(userId);
	}
}
