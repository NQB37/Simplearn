import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Users, BookOpen, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Platform Overview
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium'>
          High-level metrics and health of the Simplearn platform.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-bold text-slate-500'>
              Total Users
            </CardTitle>
            <Users className='h-5 w-5 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-black'>14,235</div>
            <p className='text-sm text-slate-500 mt-1'>+1,234 this month</p>
          </CardContent>
        </Card>

        <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-bold text-slate-500'>
              Active Courses
            </CardTitle>
            <BookOpen className='h-5 w-5 text-emerald-500' />
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-black'>842</div>
            <p className='text-sm text-slate-500 mt-1'>
              +12 submitted this week
            </p>
          </CardContent>
        </Card>

        <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-bold text-slate-500'>
              Platform Health
            </CardTitle>
            <Activity className='h-5 w-5 text-teal-500' />
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-black text-emerald-500'>99.9%</div>
            <p className='text-sm text-slate-500 mt-1'>No active incidents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
