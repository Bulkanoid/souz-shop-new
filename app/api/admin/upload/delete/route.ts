import { NextRequest, NextResponse } from 'next/server';
import { unlinkSync, existsSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith('/uploads/')) {
      return new NextResponse('Недопустимый путь', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', url);

    if (!existsSync(filePath)) {
      return new NextResponse('Файл не найден', { status: 404 });
    }

    unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    return new NextResponse('Ошибка при удалении файла', { status: 500 });
  }
}