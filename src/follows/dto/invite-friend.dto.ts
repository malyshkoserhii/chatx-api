import { IsNumber } from 'class-validator';

export class InviteFriendDto {
	@IsNumber()
	followingId: number;
}
