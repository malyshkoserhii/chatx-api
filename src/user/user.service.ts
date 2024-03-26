import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async getUser(userId: number) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
		});

		delete user.hash;
		delete user.hashedRt;

		return user;
	}
}
