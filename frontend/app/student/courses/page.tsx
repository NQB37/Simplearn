import { CourseCard } from '@/components/shared/course-card';
import { MOCK_COURSES } from '@/lib/mock-data';

export default function CoursesPage() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
      {/* Page Header */}
      <div className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 md:py-20 px-6'>
        <div className='container mx-auto max-w-7xl'>
          <span className='text-teal-600 dark:text-teal-400 font-bold tracking-wider uppercase text-sm mb-3 block'>
            Course Catalog
          </span>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight'>
            Explore All Courses
          </h1>
          <p className='text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed'>
            Expand your knowledge with our library of high-quality courses
            designed for all skill levels.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto max-w-7xl px-6 py-12 md:py-16'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4'>
          <div className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
            Showing {MOCK_COURSES.length} courses
          </div>

          <div className='flex items-center gap-3'>
            {/* Filter/Sort Placeholders with modern styling */}
            <select className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer font-medium appearance-none min-w-[160px]'>
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
