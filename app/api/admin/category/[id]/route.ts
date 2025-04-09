import { sdk } from '@/lib/server/sdk';
import { NextRequest } from 'next/server';

interface Params {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
  return sdk.category.getOne(params.id);
}

export async function PUT(req: NextRequest, { params }: Params) {
  return sdk.category.update(req, params.id);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  return sdk.category.delete(params.id);
}