import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Message } from './message.model';
import { UserChat } from './user-chat.model';

@Table({
  timestamps: true
})
export class Chat extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @Column
  name?: string;

  @Default(false)
  @AllowNull(false)
  @Column
  isGroupChat!: boolean;

  @AllowNull(true)
  @ForeignKey(() => Message)
  @Column(DataType.UUID)
  lastMessageId?: string;

  @BelongsTo(() => Message)
  lastMessage!: Message;

  @HasMany(() => Message)
  messages?: Message[];

  @HasMany(() => UserChat)
  userChats?: UserChat[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;
}
