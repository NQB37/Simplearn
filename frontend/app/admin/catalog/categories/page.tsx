'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';

type Taxonomy = {
  id: string;
  name: string;
  slug: string;
  type: 'CATEGORY' | 'TAG';
};

export default function CatalogCategoriesPage() {
  const [items, setItems] = useState<Taxonomy[]>([
    {
      id: '1',
      name: 'Software Development',
      slug: 'software-development',
      type: 'CATEGORY',
    },
    { id: '2', name: 'Design', slug: 'design', type: 'CATEGORY' },
    { id: '3', name: 'React', slug: 'react', type: 'TAG' },
    { id: '4', name: 'Next.js', slug: 'nextjs', type: 'TAG' },
  ]);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'CATEGORY' | 'TAG'>('CATEGORY');

  const handleAdd = () => {
    if (!newName.trim()) return;
    const slug = newName.toLowerCase().replace(/ /g, '-');
    const newItem: Taxonomy = {
      id: Date.now().toString(),
      name: newName,
      slug,
      type: newType,
    };
    setItems([...items, newItem]);
    setNewName('');
    toast.success(`${newType === 'CATEGORY' ? 'Category' : 'Tag'} added!`);
  };

  const handleDelete = (id: string, name: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(`${name} deleted permanently.`);
  };

  const categories = items.filter((i) => i.type === 'CATEGORY');
  const tags = items.filter((i) => i.type === 'TAG');

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Taxonomy Manager
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium'>
          Create official categories and tags for instructors to use.
        </p>
      </div>

      <div className='grid gap-8 md:grid-cols-2'>
        <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
          <CardHeader className='border-b border-slate-100 dark:border-slate-800 pb-4'>
            <CardTitle className='text-lg font-bold'>
              Categories ({categories.length})
            </CardTitle>
            <CardDescription className='font-medium text-slate-500'>
              Major subjects like Math, Science, IT.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <Input
                placeholder='New Category...'
                value={newType === 'CATEGORY' ? newName : ''}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewType('CATEGORY');
                }}
                className='font-semibold dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              />
              <Button
                onClick={handleAdd}
                disabled={!newName || newType !== 'CATEGORY'}
                className='bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm active:scale-95'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant='secondary'
                  className='pl-3 pr-1 py-1 rounded-full font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 group'
                >
                  {cat.name}
                  <div
                    role='button'
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className='ml-1 p-0.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 group-hover:text-red-500 transition-colors'
                  >
                    <Trash2 className='h-3 w-3' />
                  </div>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
          <CardHeader className='border-b border-slate-100 dark:border-slate-800 pb-4'>
            <CardTitle className='text-lg font-bold'>
              Tags ({tags.length})
            </CardTitle>
            <CardDescription className='font-medium text-slate-500'>
              Specific tools, keywords, or niches.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <Input
                placeholder='New Tag...'
                value={newType === 'TAG' ? newName : ''}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewType('TAG');
                }}
                className='font-semibold dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              />
              <Button
                onClick={handleAdd}
                disabled={!newName || newType !== 'TAG'}
                className='bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm active:scale-95'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant='outline'
                  className='pl-2 pr-1 py-1.5 rounded-lg border-teal-200 bg-teal-50/50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-900/10 dark:text-teal-400 font-bold text-xs flex items-center gap-1 group'
                >
                  <TagIcon className='h-3 w-3 mr-0.5 opacity-50' />
                  {tag.name}
                  <div
                    role='button'
                    onClick={() => handleDelete(tag.id, tag.name)}
                    className='ml-1 p-0.5 rounded-sm hover:bg-red-100 dark:hover:bg-red-900/30 text-teal-600/50 group-hover:text-red-500 transition-colors'
                  >
                    <Trash2 className='h-3 w-3' />
                  </div>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
