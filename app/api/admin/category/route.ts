import { sdk } from '@/lib/server/sdk';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return sdk.category.getList(req);
}

export async function POST(req: NextRequest) {
  return sdk.category.create(req);
}
