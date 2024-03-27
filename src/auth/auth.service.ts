import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
	) {}

	async signup(dto: AuthDto) {
		const hash = await this.hashData(dto.password);

		const currentUser = await this.userService.getUserByEmail(dto.email);

		if (currentUser) {
			throw new ForbiddenException('This email already registered');
		}

		const newUser = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash,
			},
		});

		const tokens = await this.getTokens(newUser.id, newUser.email);

		await this.updateRtHash(newUser.id, tokens.refresh_token);

		return tokens;
	}

	async signin(dto: AuthDto) {
		const isUserExist = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (!isUserExist) {
			throw new ForbiddenException('Access denied!');
		}

		const isPasswordMatch = await bcrypt.compare(dto.password, isUserExist.hash);

		if (!isPasswordMatch) {
			throw new ForbiddenException('Access denied!');
		}

		const user = await this.userService.getUserById(isUserExist.id);

		const tokens = await this.getTokens(user.id, user.email);

		await this.updateRtHash(user.id, tokens.refresh_token);

		return {
			user,
			tokens,
		};
	}

	async logout(userId: number) {
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRt: {
					not: null,
				},
			},
			data: {
				hashedRt: null,
			},
		});
	}

	async refresh(userId: number, refreshToken: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user || !user.hashedRt) {
			throw new ForbiddenException('Access denied!');
		}

		const isHashMatch = await bcrypt.compare(refreshToken, user.hashedRt);

		if (!isHashMatch) {
			throw new ForbiddenException('Access denied!');
		}

		const tokens = await this.getTokens(userId, user.email);

		await this.updateRtHash(userId, tokens.refresh_token);

		delete user.hash;
		delete user.hashedRt;

		return {
			user,
			tokens,
		};
	}

	async updateRtHash(userId: number, rt: string) {
		const hash = await this.hashData(rt);
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRt: hash,
			},
		});
	}

	async getTokens(userId: number, email: string): Promise<Tokens> {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{
					secret: 'at-secret',
					// expiresIn: 60 * 15, // 15 minutes
					expiresIn: 60 * 60 * 24, // 24 hours
				},
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email,
				},
				{ secret: 'rt-secret', expiresIn: 60 * 60 * 24 * 7 }, // 7 days
			),
		]);
		return {
			access_token: at,
			refresh_token: rt,
		};
	}

	async hashData(data: string) {
		return await bcrypt.hash(data, 10);
	}
}
