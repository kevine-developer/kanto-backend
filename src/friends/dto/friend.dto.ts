import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  targetUserId: string;
}

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  q: string;

  @IsOptional()
  limit?: number;
}
