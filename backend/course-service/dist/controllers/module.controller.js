import * as moduleService from '../services/module.service.js';
export const getModules = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const modules = await moduleService.getModules(courseId);
        res.json({ modules });
    }
    catch (err) {
        console.error('Error fetching modules', err);
        res.status(500).json({ error: 'Server error retrieving modules' });
    }
};
export const createModule = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { title } = req.body;
        const module = await moduleService.createModule({
            courseId,
            title,
        });
        res.status(201).json({ module });
    }
    catch (err) {
        console.error('Error creating module', err);
        res.status(400).json({ error: err.message });
    }
};
export const updateModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const updatedModule = await moduleService.updateModule(moduleId, req.body);
        if (!updatedModule) {
            return res.status(404).json({ error: 'Module not found' });
        }
        res.json({ module: updatedModule });
    }
    catch (err) {
        console.error('Error updating module', err);
        res.status(400).json({ error: err.message });
    }
};
export const deleteModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const deletedModule = await moduleService.deleteModule(moduleId);
        if (!deletedModule) {
            return res.status(404).json({ error: 'Module not found' });
        }
        res.json({ message: 'Module deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting module', err);
        res.status(400).json({ error: 'Server error deleting module' });
    }
};
export const reorderModules = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: 'orderedIds must be an array' });
        }
        const modules = await moduleService.reorderModules(courseId, orderedIds);
        res.json({ modules });
    }
    catch (err) {
        console.error('Error reordering modules', err);
        res.status(400).json({ error: err.message });
    }
};
