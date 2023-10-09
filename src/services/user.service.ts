import bcrypt from 'bcryptjs';
import ApiError from '../utils/api-error';
import { hashPassword } from '../utils/helpers';
import { User } from '../models/user.model';

export async function _updateUser(currentUser: any, input: any) {
  const user = await User.update(input, {
    where: { id: currentUser.id },
    returning: ['id', 'name', 'email', 'createdAt', 'updatedAt']
  });
  return user[1][0];
}

export async function _deleteUser(currentUser: any) {
  const result = await User.destroy({ where: { id: currentUser.id } });
  return !!result;
}

export async function _changePassword(currentUser: any, input: any) {
  const doesOldPasswordMatch = await bcrypt.compare(input.oldPassword, currentUser.password);
  if (!doesOldPasswordMatch) throw new ApiError(602);
  const password = await hashPassword(input.newPassword);
  const result = await User.update({ password }, { where: { id: currentUser.id } });
  return !!result[0];
}
