import { Injectable } from '@nestjs/common';
import { FollowsService } from 'src/follows/follows.service';
import { FriendsService } from 'src/friends/friends.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(
		private prismaService: PrismaService,
		private followsService: FollowsService,
		private friendsService: FriendsService,
	) {}

	async getUserById(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		const friends = await this.friendsService.getFriends(userId);
		const followers = await this.followsService.getMyFollowers(userId);
		const followings = await this.followsService.getMyFollowings(userId);

		return {
			...user,
			...followers,
			...friends,
			...followings,
		};
	}

	async getUserByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	}

	async getAllUsers(userId: number) {
		const users = await this.prismaService.user.findMany({
			where: {
				id: {
					not: userId,
				},
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return users;
	}
}
