import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Length(8, 32)
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Length(8, 32)
  @IsString()
  @IsNotEmpty()
  password!: string;
}
