import { Request, Response } from 'express';
import * as documentService from '../services/document.service.js';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file provided' });
    }
    const userId = req.user?.id as string;
    const result = await documentService.uploadDocument(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      userId,
    );
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Error uploading document', err);
    res.status(500).json({ error: err.message || 'Failed to upload document' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string;
    if (!path) {
      return res.status(400).json({ error: 'Missing path query parameter' });
    }
    await documentService.deleteDocument(path);
    res.json({ message: 'Document deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting document', err);
    res.status(500).json({ error: err.message || 'Failed to delete document' });
  }
};

export const getDocumentUrl = async (req: Request, res: Response) => {
  try {
    const path = req.query.path as string;
    if (!path) {
      return res.status(400).json({ error: 'Missing path query parameter' });
    }
    const result = await documentService.getDocumentUrl(path);
    res.json(result);
  } catch (err: any) {
    console.error('Error getting document URL', err);
    res.status(500).json({ error: err.message || 'Failed to get document URL' });
  }
};
