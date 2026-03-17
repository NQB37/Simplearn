import * as lessonService from '../services/lesson.service.js';
export const getLessons = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const lessons = await lessonService.getLessons(moduleId);
        res.json({ lessons });
    }
    catch (err) {
        console.error('Error fetching lessons', err);
        res.status(500).json({ error: 'Server error retrieving lessons' });
    }
};
export const createLesson = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const { title } = req.body;
        const lesson = await lessonService.createLesson({ moduleId, title });
        res.status(201).json({ lesson });
    }
    catch (err) {
        console.error('Error creating lesson', err);
        res.status(400).json({ error: err.message });
    }
};
export const updateLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const updatedLesson = await lessonService.updateLesson(lessonId, req.body);
        if (!updatedLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json({ lesson: updatedLesson });
    }
    catch (err) {
        console.error('Error updating lesson', err);
        res.status(400).json({ error: err.message });
    }
};
export const deleteLesson = async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const deletedLesson = await lessonService.deleteLesson(lessonId);
        if (!deletedLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        res.json({ message: 'Lesson deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting lesson', err);
        res.status(400).json({ error: 'Server error deleting lesson' });
    }
};
