import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });

    this.bucketName = this.configService.get<string>('GCS_BUCKET_NAME') || 'studented-documents-prod';
  }

  /**
   * Generate signed URL for uploading a file
   * @param fileKey - Full path where file will be stored (e.g., students/user123/doc456/ver789/file.pdf)
   * @param fileSize - File size in bytes (for validation)
   * @param contentType - MIME type
   * @returns Signed upload URL valid for 5 minutes
   */
  async generateSignedUploadUrl(
    fileKey: string,
    fileSize: number,
    contentType: string,
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      contentType,
      extensionHeaders: {
        'x-goog-content-length-range': `0,${fileSize}`, // Enforce size limit
      },
    });

    this.logger.log(`Generated upload URL for ${fileKey}`);
    return url;
  }

  /**
   * Generate signed URL for downloading a file
   * @param fileKey - Full path to file
   * @returns Signed download URL valid for 15 minutes
   */
  async generateSignedDownloadUrl(fileKey: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    this.logger.log(`Generated download URL for ${fileKey}`);
    return url;
  }

  /**
   * Check if a file exists in storage
   */
  async fileExists(fileKey: string): Promise<boolean> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    const [exists] = await file.exists();
    return exists;
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileKey: string): Promise<any> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    const [metadata] = await file.getMetadata();

    return {
      size: metadata.size,
      contentType: metadata.contentType,
      created: metadata.timeCreated,
      updated: metadata.updated,
    };
  }

  /**
   * Download file to local path (for processing)
   */
  async downloadFile(fileKey: string, destinationPath: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    await file.download({ destination: destinationPath });
    this.logger.log(`Downloaded ${fileKey} to ${destinationPath}`);
  }

  /**
   * Upload file from local path
   */
  async uploadFile(localPath: string, fileKey: string, contentType?: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);

    await bucket.upload(localPath, {
      destination: fileKey,
      metadata: {
        contentType,
      },
    });

    this.logger.log(`Uploaded ${localPath} to ${fileKey}`);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileKey: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileKey);

    await file.delete();
    this.logger.log(`Deleted file ${fileKey}`);
  }

  /**
   * Copy file to new location
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const sourceFile = bucket.file(sourceKey);
    const destinationFile = bucket.file(destinationKey);

    await sourceFile.copy(destinationFile);
    this.logger.log(`Copied ${sourceKey} to ${destinationKey}`);
  }

  /**
   * List files with prefix
   */
  async listFiles(prefix: string): Promise<string[]> {
    const bucket = this.storage.bucket(this.bucketName);
    const [files] = await bucket.getFiles({ prefix });

    return files.map(file => file.name);
  }
}
