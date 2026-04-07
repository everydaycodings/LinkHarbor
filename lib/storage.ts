import fs from 'fs/promises';
import path from 'path';

const STORAGE_ROOT = process.env.DATA_PATH || path.join(process.cwd(), 'storage');

export interface JobMetadata {
  id: string;
  status: 'pending' | 'downloading' | 'zipping' | 'completed' | 'failed';
  createdAt: number;
  updatedAt: number;
  urls: string[];
  files: { name: string; size?: number; progress: number; status: 'pending' | 'completed' | 'failed' }[];
  error?: string;
  isZip?: boolean;
  createdByIp?: string;
}

export class StorageService {
  private static instance: StorageService;
  private writeQueue: Map<string, Promise<void>> = new Map();

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async init() {
    await fs.mkdir(STORAGE_ROOT, { recursive: true });
  }

  getJobPath(jobId: string): string {
    return path.join(STORAGE_ROOT, jobId);
  }

  async createJob(jobId: string, urls: string[], ip?: string): Promise<void> {
    const jobPath = this.getJobPath(jobId);
    await fs.mkdir(jobPath, { recursive: true });
    
    const metadata: JobMetadata = {
      id: jobId,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      urls,
      files: urls.map(url => ({
        name: path.basename(new URL(url).pathname) || 'file',
        progress: 0,
        status: 'pending'
      })),
      isZip: urls.length > 1,
      createdByIp: ip
    };

    await this.saveMetadata(jobId, metadata);
  }

  async saveMetadata(jobId: string, metadata: JobMetadata): Promise<void> {
    const jobPath = this.getJobPath(jobId);
    metadata.updatedAt = Date.now();
    const metadataPath = path.join(jobPath, 'metadata.json');
    const tempPath = `${metadataPath}.tmp`;

    // Ensure sequential writes for the same jobId
    const previousWrite = this.writeQueue.get(jobId) || Promise.resolve();
    const currentWrite = previousWrite.then(async () => {
      try {
        await fs.writeFile(tempPath, JSON.stringify(metadata, null, 2), 'utf-8');
        await fs.rename(tempPath, metadataPath);
      } catch (err) {
        console.error(`[Storage] Failed to save metadata for ${jobId}:`, err);
        // Clean up temp file on error
        try { await fs.unlink(tempPath); } catch {}
        throw err;
      }
    });

    this.writeQueue.set(jobId, currentWrite);

    // Clean up memory after write finishes
    currentWrite.finally(() => {
      if (this.writeQueue.get(jobId) === currentWrite) {
        this.writeQueue.delete(jobId);
      }
    });

    return currentWrite;
  }

  async getMetadata(jobId: string): Promise<JobMetadata | null> {
    const metadataPath = path.join(this.getJobPath(jobId), 'metadata.json');
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      try {
        return JSON.parse(content) as JobMetadata;
      } catch (parseError) {
        // Handle common trailing corruption by finding last closing brace
        const lastBraceIndex = content.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
          const fixedContent = content.substring(0, lastBraceIndex + 1);
          try {
            const metadata = JSON.parse(fixedContent) as JobMetadata;
            // If it parses now, save the corrected version back to disk
            await this.saveMetadata(jobId, metadata);
            console.log(`[Storage] Repaired metadata for ${jobId}`);
            return metadata;
          } catch {
            return null;
          }
        }
        return null;
      }
    } catch {
      return null;
    }
  }

  async listJobs(ip?: string): Promise<JobMetadata[]> {
    try {
      const dirs = await fs.readdir(STORAGE_ROOT);
      const jobs: JobMetadata[] = [];
      
      for (const dir of dirs) {
        const metadata = await this.getMetadata(dir);
        if (metadata) {
          if (!ip || metadata.createdByIp === ip) {
            jobs.push(metadata);
          }
        }
      }
      
      return jobs.sort((a, b) => b.createdAt - a.createdAt);
    } catch {
      return [];
    }
  }

  async cleanupExpired(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
    const now = Date.now();
    const dirs = await fs.readdir(STORAGE_ROOT);
    let count = 0;

    for (const dir of dirs) {
      const metadata = await this.getMetadata(dir);
      if (metadata && now - metadata.createdAt > maxAgeMs) {
        await fs.rm(this.getJobPath(dir), { recursive: true, force: true });
        count++;
      } else if (!metadata) {
        // If metadata is unreadable/missing, check dir mtime as fallback
        const jobPath = path.join(STORAGE_ROOT, dir);
        try {
          const stats = await fs.stat(jobPath);
          if (now - stats.mtimeMs > maxAgeMs) {
            await fs.rm(jobPath, { recursive: true, force: true });
            count++;
          }
        } catch {}
      }
    }
    
    return count;
  }

  async deleteJob(jobId: string): Promise<void> {
    const jobPath = this.getJobPath(jobId);
    await fs.rm(jobPath, { recursive: true, force: true });
  }
}

export const storage = StorageService.getInstance();
