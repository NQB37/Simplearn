import { Request, Response } from 'express';
import * as classService from '../services/class.service.js';

export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await classService.getClasses();
    res.json(classes);
  } catch (err) {
    console.error('Error fetching classes', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const classData = await classService.getClassById(req.params.id as string);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData);
  } catch (err) {
    console.error('Error fetching class', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const newClass = await classService.createClass(req.body);
    res.status(201).json(newClass);
  } catch (err: any) {
    console.error('Error creating class', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const updatedClass = await classService.updateClass(
      req.params.id as string,
      req.body,
    );
    if (!updatedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(updatedClass);
  } catch (err: any) {
    console.error('Error updating class', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const deletedClass = await classService.deleteClass(
      req.params.id as string,
    );
    if (!deletedClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting class', err);
    res.status(400).json({ error: 'Server error deleting class' });
  }
};
