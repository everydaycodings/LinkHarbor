import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || (req as any).ip || '127.0.0.1';
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  if (!id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const metadata = await storage.getMetadata(id);
  
  if (!metadata) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const ip = getClientIp(req);
  if (metadata.createdByIp && metadata.createdByIp !== ip) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(metadata);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const metadata = await storage.getMetadata(id);
  if (!metadata) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const ip = getClientIp(req);
  if (metadata.createdByIp && metadata.createdByIp !== ip) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await storage.deleteJob(id);
  return NextResponse.json({ success: true });
}
