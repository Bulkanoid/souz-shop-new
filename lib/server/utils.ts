import { NextRequest } from 'next/server';

export function parseURLParams(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt',
    direction: (searchParams.get('direction') as 'asc' | 'desc') || 'desc',
  };
}
