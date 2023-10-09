import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(3, 50)
  @IsString()
  @IsOptional()
  name!: string;
}

export class ChangePasswordDto {
  @Length(8, 32)
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @Length(8, 32)
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
