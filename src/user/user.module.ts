import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FriendsModule } from 'src/friends/friends.module';
import { FollowsModule } from 'src/follows/follows.module';

@Module({
	imports: [FriendsModule, FollowsModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
