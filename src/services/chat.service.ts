import { Op, literal } from 'sequelize';
import { Chat } from '../models/chat.model';
import { UserChat } from '../models/user-chat.model';
import { User } from '../models/user.model';
import sequelize from '../utils/db';
import ApiError from '../utils/api-error';

export async function _createOrGetPersonalChat(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const receiver = await User.findOne({ where: { id: input.receiverId } });
    if (!receiver) throw new ApiError(603);
    const chatId = await getChatIdIfPersonalChatExists([currentUser.id, input.receiverId]);
    if (chatId) return await Chat.findOne({ where: { id: chatId }, raw: true });
    return await createPersonalChat([currentUser.id, input.receiverId]);
  });
}

async function getChatIdIfPersonalChatExists(userIds: [string, string]) {
  const result = await UserChat.findAll({
    attributes: ['chatId'],
    where: {
      [Op.or]: [{ userId: userIds[0] }, { userId: userIds[1] }]
    },
    include: [
      {
        attributes: [],
        model: Chat,
        where: {
          isGroupChat: false
        }
      }
    ],
    group: ['chatId'],
    having: literal(`(COUNT(*) = 2)`),
    raw: true
  });

  if (result.length) return result[0].chatId;
  return null;
}

async function createPersonalChat(userIds: [string, string]) {
  const chat = await Chat.create({});
  const transformedUsersChatsInput = transformForCreateUserChat(chat.id, userIds);
  await UserChat.bulkCreate(transformedUsersChatsInput);
  return chat;
}

function transformForCreateUserChat(chatId: string, userIds: [string, string]) {
  const userChat1 = { chatId, userId: userIds[0] };
  const userChat2 = { chatId, userId: userIds[1] };
  return [userChat1, userChat2];
}
