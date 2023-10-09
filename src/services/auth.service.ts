import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user.model';
import ApiError from '../utils/api-error';
import { Op } from 'sequelize';
import sequelize from '../utils/db';
import { hashPassword, trimAllSpaces } from '../utils/helpers';
import { Request } from 'express';
import env from '../utils/env-vars';

export async function _register(input: any) {
  return sequelize.transaction(async trx => {
    const existedUserWithEmail = await User.findOne({
      where: { email: { [Op.iLike]: input.email } }
    });
    if (existedUserWithEmail) throw new ApiError(600);
    input = await transformInputForRegister(input);
    const user = await User.create(input);
    return !!user;
  });
}

export async function _login(input: any) {
  return sequelize.transaction(async trx => {
    const user = await User.findOne({
      where: { email: { [Op.iLike]: input.email } },
      raw: true
    });
    if (!user) throw new ApiError(601);
    await matchPassword(input.password, user.password);
    const { password, ...data } = appendAuthTokenToUser(user);
    return data;
  });
}

async function transformInputForRegister(input: any) {
  return {
    ...input,
    name: trimAllSpaces(input.name),
    password: await hashPassword(input.password)
  };
}

async function matchPassword(password: string, hash: string) {
  const isMatched = await bcrypt.compare(password, hash);
  if (!isMatched) throw new ApiError(601);
}

function generateAuthToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '1d' });
}

function appendAuthTokenToUser(user: User) {
  return Object.assign(user, { token: generateAuthToken(user.id) });
}

export async function getUserFromHeaders(req: Request) {
  try {
    const token = getAuthTokenFromHeaders(req);
    if (!token) return null;
    const jwtPayload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return await User.findOne({
      where: { id: jwtPayload?.userId },
      attributes: { exclude: ['password'] },
      raw: true
    });
  } catch (error) {
    // invalid signature OR jwt expired
    return null;
  }
}

function getAuthTokenFromHeaders(req: Request) {
  if (req.headers && (req.headers.authorization || req.headers.Authorization))
    return ((req.headers.authorization ?? req.headers.Authorization) as string).split(' ')[1];
  else return null;
}
