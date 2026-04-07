import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';

function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || (req as any).ip || '127.0.0.1';
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const metadata = await storage.getMetadata(id);

  if (!metadata || metadata.status !== 'completed') {
    return NextResponse.json({ error: 'Job not found or not completed' }, { status: 404 });
  }

  const ip = getClientIp(req);
  if (metadata.createdByIp && metadata.createdByIp !== ip) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const jobPath = storage.getJobPath(id);
  let filePath: string;
  let fileName: string;

  if (metadata.isZip) {
    fileName = `LinkHarbor-${id}.zip`;
    filePath = path.join(jobPath, fileName);
  } else {
    fileName = metadata.files[0].name;
    filePath = path.join(jobPath, fileName);
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const stats = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath, { highWaterMark: 1024 * 1024 }); // 1MB Chunks
  const webStream = Readable.toWeb(fileStream);

  return new NextResponse(webStream as any, {
    headers: {
      'Content-Type': metadata.isZip ? 'application/zip' : 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': stats.size.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no', // Disable Nginx proxy buffering
      'Connection': 'keep-alive',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
