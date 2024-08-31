import { Module } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { AuthController } from './controller/auth.controller';
import { UserService } from './application/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, UserRepository],
})
export class UsersModule {}
