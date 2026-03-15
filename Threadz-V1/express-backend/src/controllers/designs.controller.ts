import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { uploadDesignImage, deleteFile } from '../utils/storage';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { v4 as uuidv4 } from 'uuid';

// In-memory mock jobs matching FastAPI behavior
const aiJobs: Record<string, any> = {};

export const uploadDesign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    const { design_name, is_public, tags } = req.body;
    const user = req.user;

    if (!file) return res.status(400).json({ detail: 'File is required' });

    if (!design_name) return res.status(400).json({ detail: 'Invalid design name' });

    const { url, thumbnailUrl } = await uploadDesignImage(file);

    const newDesign = await prisma.design.create({
      data: {
        user_id: user.user_id,
        design_name,
        design_source: 'upload',
        image_url: url,
        thumbnail_url: thumbnailUrl,
        is_public: is_public === 'true' || is_public === true,
        tags: tags || null,
        file_size_kb: Math.round(file.size / 1024),
        width_px: 800,
        height_px: 800,
        dpi: 300,
      },
    });

    res.status(201).json(newDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Failed to save design' });
  }
};

export const generateDesign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, style, is_public, tags } = req.body;
    const user = req.user;

    if (!prompt || prompt.length < 3) return res.status(400).json({ detail: 'Prompt must be at least 3 characters long' });

    const newDesign = await prisma.design.create({
      data: {
        user_id: user.user_id,
        design_name: `AI Generated: ${prompt.substring(0, 50)}...`,
        design_source: 'ai',
        image_url: '',
        thumbnail_url: '',
        is_public: is_public === 'true' || is_public === true,
        tags: tags || null,
        file_size_kb: 0,
        width_px: 1024,
        height_px: 1024,
        dpi: 300,
      },
    });

    const jobId = uuidv4();
    
    // Simulate Background Task queueing
    aiJobs[jobId] = {
      job_id: jobId,
      status: 'processing',
      design_id: newDesign.design_id,
      user_id: user.user_id
    };

    setTimeout(async () => {
      const genericUrl = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80&rand=${jobId}`;
      await prisma.design.update({
        where: { design_id: newDesign.design_id },
        data: { image_url: genericUrl, thumbnail_url: genericUrl, ai_prompt: prompt, ai_style: style }
      });
      aiJobs[jobId].status = 'completed';
    }, 8000);

    res.status(201).json(newDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Failed to start AI generation' });
  }
};

export const exploreDesigns = async (req: Request, res: Response) => {
  try {
    const skip = parseInt((req.query.skip as string) || '0');
    const limit = parseInt((req.query.limit as string) || '20');
    const search = req.query.search as string | undefined;

    const whereClause: any = { is_public: true };
    if (search) {
      whereClause.design_name = { contains: search, mode: 'insensitive' };
    }

    const designs = await prisma.design.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    });

    res.json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Failed to fetch designs' });
  }
};

export const getMyDesigns = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const skip = parseInt((req.query.skip as string) || '0');
    const limit = parseInt((req.query.limit as string) || '20');
    const user = req.user;

    const designs = await prisma.design.findMany({
      where: { user_id: user.user_id },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    });

    res.json(designs);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch designs' });
  }
};

export const getDesign = async (req: Request, res: Response) => {
  try {
    const design_id = req.params.design_id as string;
    const design = await prisma.design.findUnique({ where: { design_id } });

    if (!design) return res.status(404).json({ detail: 'Design not found' });
    
    res.json(design);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch design' });
  }
};

export const deleteDesignHandler = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const design_id = req.params.design_id as string;
    const user = req.user;

    const design = await prisma.design.findUnique({ where: { design_id } });

    if (!design) return res.status(404).json({ detail: 'Design not found' });
    if (design.user_id !== user.user_id) return res.status(403).json({ detail: 'Not authorized' });

    await deleteFile(design.image_url);

    await prisma.design.delete({ where: { design_id } });

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    res.status(500).json({ detail: 'Failed to delete design' });
  }
};

// Mock endpoints matching FastAPI simulate_stable_diffusion_generation exactly
export const generateAiDesignMock = async (req: Request, res: Response) => {
  const { prompt, style, num_variations = 4 } = req.body;
  const jobId = uuidv4();

  aiJobs[jobId] = {
    job_id: jobId,
    status: 'processing',
    designs: []
  };

  setTimeout(() => {
    const designs = Array.from({ length: num_variations }).map((_, i) => {
      const placeholderUrl = `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80&rand=${jobId}_${i}`;
      return {
        design_id: uuidv4(),
        image_url: placeholderUrl,
        thumbnail_url: placeholderUrl,
        ai_prompt: prompt,
        ai_style: style
      };
    });
    aiJobs[jobId].status = 'completed';
    aiJobs[jobId].designs = designs;
  }, 8000);

  res.status(202).json({
    job_id: jobId,
    status: 'processing',
    estimated_time: 8,
    message: 'AI generation via Stable Diffusion in progress'
  });
};

export const getAiStatusMock = async (req: Request, res: Response) => {
  const jobId = req.params.job_id as string;
  if (!aiJobs[jobId]) return res.status(404).json({ detail: 'Job not found' });
  res.json(aiJobs[jobId]);
};
