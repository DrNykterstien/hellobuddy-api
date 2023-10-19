import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID('4')
  @IsNotEmpty()
  chatId!: string;

  @IsString()
  @IsOptional()
  content?: string;
}
