import { Op, literal } from 'sequelize';
import { Chat } from '../models/chat.model';
import { UserChat } from '../models/user-chat.model';
import { User } from '../models/user.model';
import ApiError from '../utils/api-error';
import sequelize from '../utils/db';
import { trimAllSpaces } from '../utils/helpers';

export async function _getChat(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const { chatId } = input;
    const userChat = await UserChat.findOne({
      where: { userId: currentUser.id, chatId }
    });
    if (!userChat) throw new ApiError(610);
    const chat = await Chat.findOne({
      where: { id: chatId },
      raw: true
    });
    return chat;
  });
}
export async function _createOrGetPersonalChat(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const receiver = await User.findOne({ where: { id: input.receiverId } });
    if (!receiver) throw new ApiError(603);
    const chatId = await getChatIdIfPersonalChatExists([currentUser.id, input.receiverId]);
    if (chatId) return await Chat.findOne({ where: { id: chatId }, raw: true });
    return await createPersonalChat([currentUser.id, input.receiverId]);
  });
}

export async function _createGroupChat(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const participants = await User.findAll({
      where: { id: input.participants },
      attributes: ['id'],
      raw: true
    });

    let participantIds = participants.map(participant => participant.id);
    participantIds = participantIds.filter(id => id !== currentUser.id);

    const chat = await Chat.create({ name: trimAllSpaces(input.name), isGroupChat: true });
    const transformedUserChats = transformForCreateUserChatsForGroupChat(
      chat.id,
      currentUser.id,
      participantIds
    );
    await UserChat.bulkCreate(transformedUserChats);
    return chat;
  });
}

export async function _addParticipants(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const { chatId, participants } = input;
    const { groupAdminIds, groupParticipantIds } =
      await getExistedGroupChatAdminsAndParticipants(chatId);

    if (![...groupAdminIds, ...groupParticipantIds].includes(currentUser.id))
      throw new ApiError(610);

    if (!groupAdminIds.includes(currentUser.id)) throw new ApiError(611);

    const newParticipants = participants.filter(
      (id: string) => ![...groupAdminIds, ...groupParticipantIds].includes(id)
    );
    const validNewParticipants = await User.findAll({
      where: { id: newParticipants },
      attributes: ['id'],
      raw: true
    });

    const userChats = validNewParticipants.map(user => {
      return { chatId, userId: user.id };
    });

    await UserChat.bulkCreate(userChats);
    return true;
  });
}

export async function _removeParticipant(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const { chatId, participantId } = input;
    const { groupAdminIds, groupParticipantIds } =
      await getExistedGroupChatAdminsAndParticipants(chatId);

    if (![...groupAdminIds, ...groupParticipantIds].includes(currentUser.id))
      throw new ApiError(610);

    if (!groupAdminIds.includes(currentUser.id)) throw new ApiError(611);

    if (![...groupAdminIds, ...groupParticipantIds].includes(participantId))
      throw new ApiError(613);

    if (currentUser.id === participantId && groupAdminIds.length === 1) throw new ApiError(612);

    await UserChat.destroy({ where: { chatId, userId: participantId } });
    return true;
  });
}

export async function _leaveGroupChat(currentUser: any, input: any) {
  return await sequelize.transaction(async trx => {
    const { chatId } = input;
    const { groupAdminIds, groupParticipantIds } =
      await getExistedGroupChatAdminsAndParticipants(chatId);

    if (![...groupAdminIds, ...groupParticipantIds].includes(currentUser.id))
      throw new ApiError(610);

    if (groupAdminIds.includes(currentUser.id) && groupAdminIds.length === 1)
      throw new ApiError(612);

    await UserChat.destroy({ where: { chatId, userId: currentUser.id } });
    return true;
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

function transformForCreateUserChatsForGroupChat(
  chatId: string,
  adminId: string,
  userIds: string[]
) {
  const userChats = userIds.map(id => {
    return { chatId, userId: id };
  });
  const adminUserChat = { chatId, userId: adminId, isChatAdmin: true };
  return [...userChats, adminUserChat];
}

async function getExistedGroupChatAdminsAndParticipants(chatId: string) {
  const result = await UserChat.findAll({
    attributes: ['userId', 'isChatAdmin'],
    where: { chatId },
    include: [
      {
        attributes: [],
        model: Chat,
        where: {
          isGroupChat: true
        }
      }
    ],
    order: [['isChatAdmin', 'DESC']],
    raw: true
  });

  if (!result.length) throw new ApiError(610);

  const groupAdminIds: string[] = [];
  const groupParticipantIds: string[] = [];
  result.forEach(e => {
    if (!e.isChatAdmin) groupParticipantIds.push(e.userId);
    else groupAdminIds.push(e.userId);
  });
  return { groupAdminIds, groupParticipantIds };
}
