import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeclineFollowerDto, InviteFriendDto } from './dto';

@Injectable()
export class FollowsService {
	constructor(private prismaService: PrismaService) {}

	async inviteFriend(body: InviteFriendDto, userId: number) {
		// I am followedBy Follower
		// I am following a specific user (i.e. this user is being followed by me)

		await this.prismaService.follows.create({
			data: {
				followedBy: {
					connect: {
						id: userId,
					},
				},
				following: {
					connect: {
						id: body.followingId,
					},
				},
			},
		});

		return {
			message: 'Invite was sent',
		};
	}

	async cancelInvitation(body: DeclineFollowerDto, userId: number) {
		await this.prismaService.follows.delete({
			where: {
				followingId_followedById: {
					followedById: userId,
					followingId: body.myFollowerUserId,
				},
			},
		});

		return {
			message: 'You declined invitation',
		};
	}

	async declineInvitation(body: DeclineFollowerDto, userId: number) {
		await this.prismaService.follows.delete({
			where: {
				followingId_followedById: {
					followedById: body.myFollowerUserId,
					followingId: userId,
				},
			},
		});

		return {
			message: 'You declined invitation',
		};
	}

	async getMyFollowers(userId: number) {
		const followers = await this.prismaService.follows.findMany({
			where: {
				followingId: userId,
			},
		});
		const myFollowerIds = followers.map((el) => el.followedById);
		const myFolowers = await this.prismaService.user.findMany({
			where: {
				id: {
					in: myFollowerIds,
				},
			},
			select: {
				id: true,
				email: true,
			},
		});

		return {
			followers: myFolowers,
		};
	}

	async getMyFollowings(userId: number) {
		const followings = await this.prismaService.follows.findMany({
			where: {
				followedById: userId,
			},
		});
		const myFollowingsIds = followings.map((el) => el.followingId);
		const myFolowings = await this.prismaService.user.findMany({
			where: {
				id: {
					in: myFollowingsIds,
				},
			},
			select: {
				id: true,
				email: true,
			},
		});

		return {
			followings: myFolowings,
		};
	}
}
