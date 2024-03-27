import { IsNumber } from 'class-validator';

export class DeclineFollowerDto {
	@IsNumber()
	myFollowerUserId: number;
}
