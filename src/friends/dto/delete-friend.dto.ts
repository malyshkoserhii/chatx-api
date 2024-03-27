import { IsNumber } from 'class-validator';

export class DeleteFriendDto {
	@IsNumber()
	myFriendId: number;
}
