import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock } from 'lucide-react';

export default function StudentDashboardPage() {
  const currentCourses = [
    {
      id: '1',
      title: 'React 19 for Beginners',
      progress: 34,
      lastViewed: '2 hours ago',
      instructor: 'John Doe',
    },
    {
      id: '2',
      title: 'Advanced GraphQL Server Management',
      progress: 12,
      lastViewed: 'Yesterday',
      instructor: 'Jane Smith',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          My Learning
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium'>
          Resume where you left off.
        </p>
      </div>

      <div className='space-y-6'>
        {currentCourses.map((course) => (
          <Card
            key={course.id}
            className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-shadow dark:bg-slate-900'
          >
            <div className='flex flex-col md:flex-row'>
              <div className='w-full md:w-64 h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-r border-slate-200 dark:border-slate-800 relative'>
                <PlayCircle className='h-10 w-10 text-slate-300 dark:text-slate-600 transition-transform group-hover:scale-110 group-hover:text-teal-500' />
              </div>
              <div className='flex-1 p-6 flex flex-col justify-between space-y-4'>
                <div>
                  <h3 className='font-extrabold text-xl text-slate-900 dark:text-slate-50'>
                    {course.title}
                  </h3>
                  <p className='text-sm font-medium text-slate-500'>
                    By {course.instructor}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-end text-sm font-bold'>
                    <span className='text-slate-700 dark:text-slate-300'>
                      {course.progress}% Complete
                    </span>
                    <span className='text-slate-400 font-medium flex items-center gap-1 text-xs'>
                      <Clock className='h-3 w-3' />
                      {course.lastViewed}
                    </span>
                  </div>
                  <Progress
                    value={course.progress}
                    className='h-2 bg-slate-100 dark:bg-slate-800'
                  />
                </div>
              </div>
              <div className='p-6 flex items-center justify-start md:justify-center border-t md:border-t-0 border-slate-200 dark:border-slate-800'>
                <Button className='w-full md:w-auto rounded-full font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 active:scale-95 transition-all'>
                  Resume Course
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
