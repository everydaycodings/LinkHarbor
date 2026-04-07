import axios from 'axios';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import pLimit from 'p-limit';
import { storage } from './storage';

const CONCURRENCY_LIMIT = 3;

export class DownloaderService {
  private limit = pLimit(CONCURRENCY_LIMIT);
  private lastUpdateMap: Map<string, number> = new Map();

  async downloadJob(jobId: string) {
    const metadata = await storage.getMetadata(jobId);
    if (!metadata) return;

    try {
      metadata.status = 'downloading';
      await storage.saveMetadata(jobId, metadata);

      const downloadTasks = metadata.urls.map((url, index) => 
        this.limit(() => this.downloadFile(jobId, url, index))
      );

      await Promise.all(downloadTasks);

      // Refresh metadata
      const updatedMetadata = await storage.getMetadata(jobId);
      if (!updatedMetadata) return;

      if (updatedMetadata.urls.length > 1) {
        updatedMetadata.status = 'zipping';
        await storage.saveMetadata(jobId, updatedMetadata);
        await this.createZip(jobId);
      }

      updatedMetadata.status = 'completed';
      await storage.saveMetadata(jobId, updatedMetadata);
    } catch (error) {
      metadata.status = 'failed';
      metadata.error = error instanceof Error ? error.message : 'Unknown error';
      await storage.saveMetadata(jobId, metadata);
    }
  }

  private async downloadFile(jobId: string, url: string, index: number) {
    const metadata = await storage.getMetadata(jobId);
    if (!metadata) return;

    const fileName = path.basename(new URL(url).pathname) || `file-${index}`;
    const filePath = path.join(storage.getJobPath(jobId), fileName);

    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream'
      });

      const totalLength = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedLength = 0;

      const writer = fs.createWriteStream(filePath);
      
      response.data.on('data', (chunk: Buffer) => {
        downloadedLength += chunk.length;
        if (totalLength > 0) {
          const progress = Math.round((downloadedLength / totalLength) * 100);
          
          // Throttle updates to once every 500ms
          const updateKey = `${jobId}-${index}`;
          const now = Date.now();
          const lastUpdate = this.lastUpdateMap.get(updateKey) || 0;
          
          if (now - lastUpdate > 2000) {
            this.lastUpdateMap.set(updateKey, now);
            this.updateFileProgress(jobId, index, progress).catch(() => {});
          }
        }
      });

      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', async () => {
          this.lastUpdateMap.delete(`${jobId}-${index}`);
          await this.updateFileProgress(jobId, index, 100, 'completed');
          resolve(null);
        });
        writer.on('error', (err) => {
          this.updateFileProgress(jobId, index, 0, 'failed');
          reject(err);
        });
      });
    } catch (error) {
      this.updateFileProgress(jobId, index, 0, 'failed');
      throw error;
    }
  }

  private async updateFileProgress(jobId: string, index: number, progress: number, status?: 'completed'|'failed') {
    const metadata = await storage.getMetadata(jobId);
    if (!metadata) return;

    if (metadata.files[index]) {
      metadata.files[index].progress = progress;
      if (status) metadata.files[index].status = status;
      await storage.saveMetadata(jobId, metadata);
    }
  }

  private async createZip(jobId: string) {
    const jobPath = storage.getJobPath(jobId);
    const metadata = await storage.getMetadata(jobId);
    if (!metadata) return;

    const zipPath = path.join(jobPath, `LinkHarbor-${jobId}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);

      // Add all successfully downloaded files
      metadata.files.forEach(file => {
        if (file.status === 'completed') {
          const filePath = path.join(jobPath, file.name);
          if (fs.existsSync(filePath)) {
            archive.file(filePath, { name: file.name });
          }
        }
      });

      archive.finalize();
    });
  }
}

export const downloader = new DownloaderService();
