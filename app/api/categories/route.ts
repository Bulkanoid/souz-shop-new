import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // Убедись, что Prisma подключен

export async function GET() {
  try {
    const categories = await prisma.category.findMany(); // Загружаем категории из БД
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка загрузки категорий" }, { status: 500 });
  }
}
