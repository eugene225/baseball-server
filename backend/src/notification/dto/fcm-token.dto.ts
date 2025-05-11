import { IsNumber, IsString, IsOptional, IsIn } from 'class-validator';

export class SaveFcmTokenDto {
  @IsNumber()
  userId: number;

  fcmToken: string;

  @IsIn(['mobile', 'desktop', 'tablet', null])
  deviceType: string;
}

export class DeleteFcmTokenDto {
  @IsNumber()
  userId: number;
  
  @IsIn(['mobile', 'desktop', 'tablet', null])
  deviceType: string;
}

export class FcmTokenResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  fcmToken: string;

  @IsString()
  deviceType: string;

  @IsNumber()
  userId: number;
} 