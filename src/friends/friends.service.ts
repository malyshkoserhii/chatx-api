import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFriendDto } from './dto';
import { DeleteFriendDto } from './dto';
import { FollowsService } from 'src/follows/follows.service';

@Injectable()
export class FriendsService {
	constructor(private prismaService: PrismaService, private followsService: FollowsService) {}

	async getFriends(userId: number) {
		const friends = await this.prismaService.user.findMany({
			where: {
				id: userId,
			},
			include: {
				friends: {
					select: {
						id: true,
						email: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});

		return {
			friends: friends[0]?.friends,
		};
	}

	async addFriend(body: AddFriendDto, userId: number) {
		await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				friends: {
					connect: {
						id: body.friendId,
					},
				},
			},
		});

		await this.prismaService.user.update({
			where: {
				id: body.friendId,
			},
			data: {
				friends: {
					connect: {
						id: userId,
					},
				},
			},
		});

		await this.followsService.declineInvitation({ myFollowerUserId: body.friendId }, userId);

		return {
			message: 'Friend added!',
		};
	}

	async deleteFriend(body: DeleteFriendDto, userId: number) {
		await this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				friends: {
					disconnect: {
						id: body.myFriendId,
					},
				},
			},
		});

		await this.prismaService.user.update({
			where: {
				id: body.myFriendId,
			},
			data: {
				friends: {
					disconnect: {
						id: userId,
					},
				},
			},
		});

		return {
			message: 'Friend deleted!',
		};
	}
}
