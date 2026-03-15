import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true },
      include: { variants: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: { variants: true },
    });
    
    if (!product) return res.status(404).json({ detail: 'Product not found' });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch product' });
  }
};
