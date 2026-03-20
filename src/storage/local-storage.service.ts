import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { randomBytes } from 'crypto';

/**
 * Local File Storage Service
 *
 * USE THIS FOR DEVELOPMENT & DEMO
 * - No cost (free!)
 * - No external dependencies
 * - Perfect for MVP and investor demos
 *
 * Switch to Google Cloud Storage when you have paying customers
 */
@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    // Store files in project root /uploads directory
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Upload directory ready: ${this.uploadDir}`);
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
    }
  }

  /**
   * Generate a signed upload URL
   * For local storage, we return an endpoint on our server
   */
  async generateSignedUploadUrl(
    fileKey: string,
    fileSize: number,
    contentType: string,
  ): Promise<string> {
    // Generate a temporary upload token
    const token = randomBytes(32).toString('hex');

    // In a real implementation, store this token with expiry in Redis
    // For demo, we'll just return a URL

    const uploadUrl = `${this.getBaseUrl()}/api/v1/storage/upload/${token}`;

    this.logger.log(`Generated upload URL for: ${fileKey}`);

    return uploadUrl;
  }

  /**
   * Generate a signed download URL
   * For local storage, we return a direct file URL
   */
  async generateSignedDownloadUrl(fileKey: string): Promise<string> {
    const filePath = this.getFilePath(fileKey);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error('File not found');
    }

    // Generate download token
    const token = randomBytes(32).toString('hex');

    const downloadUrl = `${this.getBaseUrl()}/api/v1/storage/download/${token}`;

    this.logger.log(`Generated download URL for: ${fileKey}`);

    return downloadUrl;
  }

  /**
   * Save uploaded file
   */
  async saveFile(fileKey: string, buffer: Buffer): Promise<void> {
    const filePath = this.getFilePath(fileKey);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, buffer);

    this.logger.log(`File saved: ${fileKey}`);
  }

  /**
   * Download file
   */
  async downloadFile(fileKey: string): Promise<Buffer> {
    const filePath = this.getFilePath(fileKey);

    try {
      const buffer = await fs.readFile(filePath);
      this.logger.log(`File downloaded: ${fileKey}`);
      return buffer;
    } catch (error) {
      this.logger.error(`File download failed: ${error.message}`);
      throw new Error('File not found');
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(fileKey: string): Promise<boolean> {
    const filePath = this.getFilePath(fileKey);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(fileKey: string): Promise<void> {
    const filePath = this.getFilePath(fileKey);

    try {
      await fs.unlink(filePath);
      this.logger.log(`File deleted: ${fileKey}`);
    } catch (error) {
      this.logger.error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Get file size
   */
  async getFileSize(fileKey: string): Promise<number> {
    const filePath = this.getFilePath(fileKey);

    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Get full file path on disk
   */
  private getFilePath(fileKey: string): string {
    // Remove any leading slashes from fileKey
    const cleanKey = fileKey.replace(/^\/+/, '');
    return path.join(this.uploadDir, cleanKey);
  }

  /**
   * Get base URL for this server
   */
  private getBaseUrl(): string {
    const port = this.configService.get('PORT', 3000);
    return `http://localhost:${port}`;
  }

  /**
   * Get storage statistics (for admin dashboard)
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    uploadDir: string;
  }> {
    let totalFiles = 0;
    let totalSize = 0;

    async function scanDir(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else {
          totalFiles++;
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    }

    try {
      await scanDir(this.uploadDir);
    } catch (error) {
      this.logger.error(`Failed to scan storage: ${error.message}`);
    }

    return {
      totalFiles,
      totalSize,
      uploadDir: this.uploadDir,
    };
  }
}
