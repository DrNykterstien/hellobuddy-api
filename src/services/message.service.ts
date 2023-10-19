import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { UserChat } from '../models/user-chat.model';
import ApiError from '../utils/api-error';
import sequelize from '../utils/db';

export async function _sendMessage(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const { chatId, content } = input;
    const userChat = await UserChat.findOne({
      where: { chatId, userId: currentUser.id }
    });

    if (!userChat) throw new ApiError(610);

    const message = await Message.create({
      chatId,
      senderId: currentUser.id,
      ...(content && { content: content.trim() })
    });
    await Chat.update({ lastMessageId: message.id }, { where: { id: chatId } });
    return message;
  });
}
