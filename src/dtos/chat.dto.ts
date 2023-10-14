import { IsNotEmpty, IsUUID } from 'class-validator';
import { MessageAttachmentTypesEnum } from '../constants/enums';

export class MessageAttachmentType {
  url!: string;
  type!: MessageAttachmentTypesEnum;
}

export class createOrGetPersonalChatDto {
  @IsUUID('4')
  @IsNotEmpty()
  receiverId!: string;
}
