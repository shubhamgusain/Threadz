import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { 
  uploadDesign, 
  generateDesign, 
  exploreDesigns, 
  getMyDesigns, 
  getDesign, 
  deleteDesignHandler,
  generateAiDesignMock,
  getAiStatusMock
} from '../controllers/designs.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import fs from 'fs';

// Setup multer storage
const uploadDir = path.join(__dirname, '../../uploads/designs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = Router();

router.post('/upload', authenticateToken, upload.single('file'), uploadDesign);
router.post('/generate', authenticateToken, generateDesign);
router.get('/', exploreDesigns);
router.get('/explore', exploreDesigns); // Paginated alias mapped to the same underlying search in simple migration
router.get('/my-designs', authenticateToken, getMyDesigns);
router.get('/:design_id', getDesign);
router.delete('/:design_id', authenticateToken, deleteDesignHandler);

// Background Mock Routes
router.post('/generate-ai', generateAiDesignMock);
router.get('/ai-status/:job_id', getAiStatusMock);

export default router;
