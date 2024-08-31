import { AuthService } from './auth/auth.service';
import { Module } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { AuthController } from './controller/auth.controller';
import { UserService } from './application/user.service';
import { UserController } from './controller/user.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') || '60m',
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, UserRepository, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
