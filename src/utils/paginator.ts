import { Order } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

interface PaginationResponse<T> {
  pageInfo: {
    hasNext: boolean;
    hasBefore: boolean;
    page: number;
    totalCount: number;
    totalPages: number;
    limit: number;
  };
  items: T[];
}

export async function paginate<T>(
  model: ModelCtor,
  where = {},
  order?: Order,
  include: any[] = [],
  page = 1,
  limit = 20,
  attributes: any[] = [],
  nestAndRaw = true
): Promise<PaginationResponse<T>> {
  const totalCount = await model.count({ where });

  if (limit > 60) limit = 60;
  if (limit < 1) limit = 20;
  if (page < 1) page = 1;

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const offset = page > 1 ? (page - 1) * limit : 0;
  const hasNext = offset + limit < totalCount;

  if (Array.isArray(order) && !order.length) order = [['createdAt', 'DESC']];

  const items = await model.findAll({
    where,
    include,
    limit,
    offset,
    ...(order && { order }),
    ...(attributes && attributes.length && { attributes }),
    nest: nestAndRaw,
    raw: nestAndRaw
  });

  return {
    pageInfo: {
      hasBefore: page > 1,
      hasNext,
      page,
      totalCount,
      totalPages,
      limit
    },
    items: <any>items
  };
}
