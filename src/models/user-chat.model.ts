import { Order } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { paginate } from '../utils/paginator';
import { Chat } from './chat.model';
import { Message } from './message.model';
import { User } from './user.model';

@Table({
  timestamps: true
})
export class UserChat extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @ForeignKey(() => Chat)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE' })
  chatId!: string;

  @BelongsTo(() => Chat)
  chat!: Chat;

  @AllowNull(true)
  @ForeignKey(() => Message)
  @Column(DataType.UUID)
  lastReadMessageId?: string;

  @BelongsTo(() => Message)
  lastReadMessage?: Message;

  @Default(false)
  @AllowNull(false)
  @Column
  isChatAdmin!: boolean;

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
    return paginate<UserChat>(this, where, order, include, page, limit, attributes, nestAndRaw);
  }
}
