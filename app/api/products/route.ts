import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Временный хардкод категорий вместо `type`
    const categoryMapping: Record<string, string[]> = {
      hits: ["категория1-id", "категория2-id"], // Заменить на реальные ID категорий для "Хиты"
      new: ["категория3-id"], // Заменить на ID категорий для "Новинки"
      recommended: ["категория4-id"], // Заменить на ID категорий для "Рекомендации"
    };

    // Если переданный `type` недопустимый – используем `hits` по умолчанию
    const validType = type && categoryMapping[type] ? type : "hits";
    const categoryIds = categoryMapping[validType];

    // Загружаем товары (максимум 10, случайные)
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        stock: { gt: 0 }, // Показываем только товары в наличии
      },
      take: 10,
      orderBy: { createdAt: "desc" }, // Берём последние добавленные
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
    return NextResponse.json({ error: "Ошибка загрузки товаров", details: error.message }, { status: 500 });
  }
}
