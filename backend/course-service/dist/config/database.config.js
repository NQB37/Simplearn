import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/simplearn_courses';
        await mongoose.connect(uri);
        console.log('MongoDB Connected to Course DB');
    }
    catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};
export default connectDB;
