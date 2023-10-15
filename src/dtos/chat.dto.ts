import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length
} from 'class-validator';
import { MessageAttachmentTypesEnum } from '../constants/enums';

export class MessageAttachmentType {
  url!: string;
  type!: MessageAttachmentTypesEnum;
}

export class CreateOrGetPersonalChatDto {
  @IsUUID('4')
  @IsNotEmpty()
  receiverId!: string;
}

export class GetChatDto {
  @IsUUID('4')
  @IsNotEmpty()
  chatId!: string;
}

export class CreateGroupChatDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID('4', { each: true })
  @ArrayUnique()
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  participants!: string[];
}

export class AddParticipantsDto {
  @IsUUID('4')
  @IsNotEmpty()
  chatId!: string;

  @IsUUID('4', { each: true })
  @ArrayUnique()
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  participants!: string[];
}

export class RemoveParticipantDto {
  @IsUUID('4')
  @IsNotEmpty()
  chatId!: string;

  @IsUUID('4')
  @IsNotEmpty()
  participantId!: string;
}
