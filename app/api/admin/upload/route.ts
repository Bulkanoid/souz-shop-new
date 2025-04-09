// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { IncomingForm, Files } from 'formidable';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import type { IncomingMessage } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const model = url.searchParams.get('model') || 'general';
  const variant = url.searchParams.get('variant') || '';

  const uploadFolder = variant ? `${model}/${variant}` : model;
  const uploadDir = path.join(process.cwd(), 'public/uploads', uploadFolder);
  mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({ uploadDir, keepExtensions: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseForm = promisify<IncomingMessage, any>(form.parse.bind(form));

  try {
    const result = await parseForm(req as unknown as IncomingMessage);
    const rawFiles: Files = result[1];
    const filesArray = Object.values(rawFiles).flat();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedFiles = filesArray.map((file: any) => {
      const ext = path.extname(file.originalFilename || '') || '.bin';
      const newName = `${randomUUID()}${ext}`;
      const newPath = path.join(uploadDir, newName);
      const fileData = readFileSync(file.filepath);
      writeFileSync(newPath, fileData);
      return {
        name: file.originalFilename,
        type: file.mimetype,
        url: `/uploads/${uploadFolder}/${newName}`,
      };
    });

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return new NextResponse('Ошибка при загрузке файла', { status: 500 });
  }
}