// lib/server/sdk.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { parseURLParams } from './utils';

function createModelHandler<K extends keyof typeof prisma>(model: K) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = prisma[model] as any;

  return {
    async getList(req: NextRequest) {
      const { search, sort, direction, page, limit } = parseURLParams(req);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: Record<string, any> = search
        ? {
            OR: [
              { name_ru: { contains: search, mode: 'insensitive' } },
              { name_en: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const total = await delegate.count({ where });

      const items = await delegate.findMany({
        where,
        orderBy: sort ? { [sort]: direction ?? 'desc' } : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return NextResponse.json({ items, totalPages: Math.ceil(total / limit) });
    },

    async getOne(id: string) {
      const item = await delegate.findUnique({ where: { id } });
      if (!item) return new NextResponse('Not Found', { status: 404 });
      return NextResponse.json(item);
    },

    async create(req: NextRequest) {
      const data = await req.json();
      const created = await delegate.create({ data });
      return NextResponse.json(created);
    },

    async update(req: NextRequest, id: string) {
      const data = await req.json();
      const updated = await delegate.update({ where: { id }, data });
      return NextResponse.json(updated);
    },

    async delete(id: string) {
      await delegate.delete({ where: { id } });
      return NextResponse.json({ success: true });
    },
  };
}

export const sdk = {
  category: createModelHandler('category'),
};
