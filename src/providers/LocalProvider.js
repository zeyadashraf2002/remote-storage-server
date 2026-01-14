import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync, renameSync } from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import BaseUploadProvider from './BaseUploadProvider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LocalProvider extends BaseUploadProvider {
  constructor() {
    super();
    this.uploadDir = process.env.LOCAL_UPLOAD_PATH || 'uploads';
    this.baseUrl = process.env.STORAGE_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    // Resolved base directory (project root)
    this.basePath = path.resolve(__dirname, '../../');
    const fullUploadPath = path.join(this.basePath, this.uploadDir);
    
    if (!existsSync(fullUploadPath)) {
      mkdirSync(fullUploadPath, { recursive: true });
    }
  }

  generateFilename(originalFilename, extension) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const sanitizedName = originalFilename
      ? originalFilename.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)
      : 'file';
    return `${sanitizedName}-${timestamp}-${randomString}${extension}`;
  }

  async ensureDir(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async upload(filePathOrBuffer, options = {}) {
    const { folder = 'general', mimetype, filename } = options;

    // Handle both file paths and buffers for backward compatibility
    let buffer;
    if (typeof filePathOrBuffer === 'string') {
      // It's a file path from multer diskStorage
      buffer = await fs.readFile(filePathOrBuffer);
    } else {
      // It's a buffer
      buffer = filePathOrBuffer;
    }

    const isImage = mimetype.startsWith('image/') && !this.isPdf(mimetype);
    const isVideo = mimetype.startsWith('video/');
    const isAudio = mimetype.startsWith('audio/');
    const isPdf = this.isPdf(mimetype);

    const folderPath = path.join(this.basePath, this.uploadDir, folder);
    await this.ensureDir(folderPath);

    let savedFilename;
    let processedBuffer = buffer;
    let metadata = {};

    // For images, just use as-is since sharp is removed (to avoid Hostinger issues)
    if (isImage) {
      savedFilename = this.generateFilename(filename, '.webp');
      metadata = { format: 'webp', resourceType: 'image' };
    } else if (isVideo) {
      const ext = this.getExtensionFromMimetype(mimetype);
      savedFilename = this.generateFilename(filename, ext);
      metadata = { format: ext.replace('.', ''), resourceType: 'video' };
    } else if (isAudio) {
      const ext = this.getExtensionFromMimetype(mimetype);
      savedFilename = this.generateFilename(filename, ext);
      metadata = { format: ext.replace('.', ''), resourceType: 'video' };
    } else if (isPdf) {
      savedFilename = this.generateFilename(filename, '.pdf');
      metadata = { format: 'pdf', resourceType: 'raw' };
    } else {
      const ext = this.getExtensionFromMimetype(mimetype);
      savedFilename = this.generateFilename(filename, ext);
      metadata = { format: ext.replace('.', ''), resourceType: 'raw' };
    }

    const filePath = path.join(folderPath, savedFilename);
    
    // If it's from multer diskStorage, rename the temp file; otherwise write buffer
    if (typeof filePathOrBuffer === 'string') {
      renameSync(filePathOrBuffer, filePath);
    } else {
      await fs.writeFile(filePath, processedBuffer);
    }

    const publicId = `${folder}/${savedFilename}`;
    const url = `${this.baseUrl}/${this.uploadDir}/${folder}/${savedFilename}`;

    return {
      url,
      publicId,
      resourceType: metadata.resourceType,
      format: metadata.format,
      width: metadata.width || null,
      height: metadata.height || null,
      bytes: processedBuffer.length,
      provider: 'local'
    };
  }

  async delete(publicId) {
    try {
      const filePath = path.join(this.basePath, this.uploadDir, publicId);
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch {
      return true;
    }
  }

  getExtensionFromMimetype(mimetype) {
    const mimeToExt = {
      'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp',
      'video/mp4': '.mp4', 'video/webm': '.webm', 'audio/mpeg': '.mp3', 'application/pdf': '.pdf',
    };
    return mimeToExt[mimetype] || '.bin';
  }
}

export default LocalProvider;
