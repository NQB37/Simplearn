import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CourseCatalogPage() {
  const courses = [
    {
      title: 'The Complete Web Developer in 2026',
      author: 'Mark Z.',
      rating: 4.8,
      students: 1204,
      duration: '40h 30m',
      level: 'Beginner',
      category: 'Development',
      price: '$49.99',
    },
    {
      title: 'Advanced Docker for Microservices',
      author: 'Sarah K.',
      rating: 4.9,
      students: 843,
      duration: '12h 15m',
      level: 'Advanced',
      category: 'DevOps',
      price: '$89.00',
    },
    {
      title: 'Figma to Code Navigation',
      author: 'Leo M.',
      rating: 4.7,
      students: 2309,
      duration: '8h 00m',
      level: 'Intermediate',
      category: 'Design',
      price: '$29.99',
    },
  ];

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            Course Catalog
          </h1>
          <p className='text-slate-500 dark:text-slate-400 font-medium'>
            Explore new topics and expand your skillset.
          </p>
        </div>
        <div className='relative w-full md:w-80'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <Input
            placeholder='Search courses...'
            className='pl-10 rounded-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
          />
        </div>
      </div>

      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
        {[
          'All',
          'Development',
          'Design',
          'DevOps',
          'Business',
          'Marketing',
        ].map((cat) => (
          <Badge
            key={cat}
            variant={cat === 'All' ? 'default' : 'secondary'}
            className='rounded-full px-4 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors'
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {courses.map((course, idx) => (
          <Card
            key={idx}
            className='rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-lg transition-all dark:bg-slate-900 hover:-translate-y-1'
          >
            <div className='h-48 bg-slate-100 dark:bg-slate-800 p-4 shrink-0 transition-colors group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20'>
              {/* Image placeholder */}
              <div className='w-full h-full rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:text-teal-400 transition-colors'>
                [Course Image]
              </div>
            </div>
            <CardContent className='p-6 flex flex-col justify-between h-[calc(100%-12rem)] space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Badge
                    variant='outline'
                    className='text-teal-600 border-teal-200 dark:text-teal-400 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/10'
                  >
                    {course.category}
                  </Badge>
                  <span className='text-xs font-bold text-slate-400 flex items-center gap-1'>
                    <Star className='h-3 w-3 text-yellow-500 fill-yellow-500' />{' '}
                    {course.rating}
                  </span>
                </div>
                <h3 className='font-extrabold text-lg leading-tight line-clamp-2 text-slate-900 dark:text-slate-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors'>
                  {course.title}
                </h3>
                <p className='text-sm font-medium text-slate-500 line-clamp-1'>
                  Instructor: {course.author}
                </p>
              </div>

              <div className='space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800'>
                <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
                  <span className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' /> {course.duration}
                  </span>
                  <span className='flex items-center gap-1'>
                    <BookOpen className='h-3 w-3' /> {course.level}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='font-black text-xl text-slate-900 dark:text-slate-50'>
                    {course.price}
                  </span>
                  <Button
                    size='sm'
                    className='rounded-full font-bold bg-slate-900 dark:bg-slate-50 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors'
                  >
                    Enroll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
