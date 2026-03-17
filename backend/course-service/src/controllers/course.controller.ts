import { Request, Response } from 'express';
import * as courseService from '../services/course.service.js';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getCourses();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses', err);
    res.status(500).json({ error: 'Server error retrieving courses' });
  }
};

export const getCourseBySlug = async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseBySlug(req.params.slug as string);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ course });
  } catch (err) {
    console.error('Error fetching course', err);
    res.status(500).json({ error: 'Server error retrieving course' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, subjectId } = req.body;
    const instructorId = req.user?.id as string;
    const course = await courseService.createCourse({
      title,
      slug,
      description,
      subjectId,
      instructorId,
    });
    res.status(201).json({ course });
  } catch (err: any) {
    console.error('Error creating course', err);
    res.status(400).json({ error: err.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const updatedCourse = await courseService.updateCourse(
      req.params.id as string,
      req.body,
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (err: any) {
    console.error('Error updating course', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const deletedCourse = await courseService.deleteCourse(req.params.id as string);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting course', err);
    res.status(400).json({ error: 'Server error deleting course' });
  }
};
