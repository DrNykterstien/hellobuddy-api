import { Order } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript';
import { paginate } from '../utils/paginator';
import { Message } from './message.model';
import { UserChat } from './user-chat.model';

@Table({
  timestamps: true
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Unique
  @Column({
    set(v: string) {
      v && typeof v === 'string'
        ? (this as any).setDataValue('email', v.toLowerCase())
        : (this as any).setDataValue('email', v);
    }
  })
  email!: string;

  @AllowNull(false)
  @Column
  password!: string;

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

  static async paginate(
    where = {},
    order: Order = [['createdAt', 'DESC']],
    include: any[] = [],
    page = 1,
    limit = 20,
    attributes: any[] = [],
    nestAndRaw = true
  ) {
    return paginate<User>(this, where, order, include, page, limit, attributes, nestAndRaw);
  }
}
