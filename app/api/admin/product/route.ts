// app/api/admin/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const direction = searchParams.get('direction') === 'asc' ? 'asc' : 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: {
          category: { select: { name_ru: true } },
          brand: { select: { name_ru: true } },
        },
        orderBy: { [sort]: direction },
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: {
          OR: [
            { name_ru: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ items, totalPages });
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    return new NextResponse('Ошибка сервера', { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name_ru: data.name_ru,
        name_en: data.name_en,
        description_ru: data.description_ru,
        description_en: data.description_en,
        price: data.price,
        stock: data.stock,
        excelName: data.excelName,
        images: data.images,
        files: data.files,
        labels: data.labels,
        design: data.design,
        property: data.property,
        care: data.care,
        type: data.type ? { connect: { id: data.type } } : undefined,
        size: data.size,
        manufacturer: data.manufacturer,
        weight: data.weight,
        density: data.density,
        survivability: data.survivability,
        category: { connect: { id: data.categoryId } },
        brand: data.brandId ? { connect: { id: data.brandId } } : undefined,
        fabricVariants: data.fabricVariants?.create
          ? {
              create: data.fabricVariants.create,
            }
          : undefined,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    return new NextResponse('Ошибка при создании продукта', { status: 500 });
  }
}