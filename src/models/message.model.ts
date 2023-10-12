import { Order } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { MessageAttachmentType } from '../dtos/chat.dto';
import { paginate } from '../utils/paginator';
import { Chat } from './chat.model';
import { UserChat } from './user-chat.model';
import { User } from './user.model';

@Table({
  timestamps: true
})
export class Message extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  senderId!: string;

  @BelongsTo(() => User)
  sender!: User;

  @AllowNull(false)
  @ForeignKey(() => Chat)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  chatId!: string;

  @BelongsTo(() => Chat)
  chat!: Chat;

  @AllowNull(true)
  @Column
  content?: string;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.JSONB))
  attachments?: MessageAttachmentType[];

  @HasOne(() => UserChat)
  userChat?: UserChat;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  static async paginate(
    where = {},
    order: Order = [['createdAt', 'DESC']],
    include: any[] = [],
    page = 1,
    limit = 20,
    attributes: any[] = [],
    nestAndRaw = true
  ) {
    return paginate<Message>(this, where, order, include, page, limit, attributes, nestAndRaw);
  }
}
