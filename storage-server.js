import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import LocalProvider from './src/providers/LocalProvider.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Warning on startup if key is missing (optional but helpful)
if (!process.env.STORAGE_SERVER_API_KEY) {
  console.warn('⚠️ STORAGE_SERVER_API_KEY is not defined - some features may not work');
}

const localProvider = new LocalProvider();

app.use(cors());
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const apiKey = process.env.STORAGE_SERVER_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Request Rejected: STORAGE_SERVER_API_KEY is missing in environment variables');
    return res.status(503).json({ success: false, message: 'API Key not configured' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

const upload = multer({
  limits: { fileSize: 15 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'uploads/tmp'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

// Routes
app.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const result = await localProvider.upload(req.file.path, {
      folder: req.body.folder || 'general',
      mimetype: req.file.mimetype,
      filename: req.file.originalname,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const { publicId } = req.body;
    const success = await localProvider.delete(publicId);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const fullUploadPath = path.join(__dirname, process.env.LOCAL_UPLOAD_PATH || 'uploads');
app.use('/uploads', express.static(fullUploadPath));

app.get('/health', (req, res) => res.json({ success: true, status: 'Storage Server Ready' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Storage Server running on port ${PORT}`);
});
