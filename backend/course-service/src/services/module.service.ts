import Module, { IModule } from '../models/module.model.js';
import mongoose from 'mongoose';

export const getModules = async (courseId: string): Promise<IModule[]> => {
  return Module.find({ courseId }).sort({ order: 1 });
};

export const createModule = async (data: {
  courseId: string;
  title: string;
}): Promise<IModule> => {
  // Auto-assign order as max(existing orders) + 1
  const maxOrderModule = await Module.findOne({ courseId: data.courseId })
    .sort({ order: -1 })
    .select('order');

  const newOrder = maxOrderModule ? maxOrderModule.order + 1 : 0;

  const newModule = new Module({
    courseId: new mongoose.Types.ObjectId(data.courseId),
    title: data.title,
    order: newOrder,
  });

  return newModule.save();
};

export const updateModule = async (
  moduleId: string,
  data: Partial<Pick<IModule, 'title'>>,
): Promise<IModule | null> => {
  return Module.findByIdAndUpdate(moduleId, data, { new: true });
};

export const deleteModule = async (moduleId: string): Promise<IModule | null> => {
  return Module.findByIdAndDelete(moduleId);
};

export const reorderModules = async (
  courseId: string,
  orderedIds: string[],
): Promise<IModule[]> => {
  // Bulk update the order field for each module
  const updatePromises = orderedIds.map((moduleId, index) =>
    Module.findByIdAndUpdate(
      moduleId,
      { order: index },
      { new: true }
    )
  );

  await Promise.all(updatePromises);

  // Return the updated modules sorted by order
  return Module.find({ courseId }).sort({ order: 1 });
};