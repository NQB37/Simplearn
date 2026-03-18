'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useFieldsOfStudy, useMajors, useVocabularyMutations } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

export default function VocabularyPage() {
  const { data: fields, isLoading: isFieldsLoading } = useFieldsOfStudy();
  const { data: majors, isLoading: isMajorsLoading } = useMajors();
  const { createFieldMutation, deleteFieldMutation, createMajorMutation, deleteMajorMutation } = useVocabularyMutations();

  const [newFieldName, setNewFieldName] = useState('');
  const [newMajorName, setNewMajorName] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState('');

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    createFieldMutation.mutate(newFieldName, {
      onSuccess: () => setNewFieldName(''),
    });
  };

  const handleAddMajor = () => {
    if (!newMajorName.trim() || !selectedFieldId) return;
    createMajorMutation.mutate({ name: newMajorName, fieldOfStudyId: selectedFieldId }, {
      onSuccess: () => setNewMajorName(''),
    });
  };

  if (isFieldsLoading || isMajorsLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Vocabulary
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-normal">
          Manage fields of study and majors used in student and instructor profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Fields of Study Card */}
        <Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Fields of Study</CardTitle>
            <CardDescription>Academic categories for subjects and teaching.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New field name..."
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                aria-label="New field name"
              />
              <Button 
                onClick={handleAddField} 
                disabled={createFieldMutation.isPending || !newFieldName.trim()}
              >
                {createFieldMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-auto">
              {fields?.map((field) => (
                <div key={field._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-medium">{field.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteFieldMutation.mutate(field._id)}
                    disabled={deleteFieldMutation.isPending}
                    aria-label={`Delete ${field.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fields?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No fields added yet.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Majors Card */}
        <Card className="rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Majors</CardTitle>
            <CardDescription>Specific programs within a field of study.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
                  <SelectTrigger aria-label="Select field for new major">
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fields?.map((field) => (
                      <SelectItem key={field._id} value={field._id}>{field.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="New major name..."
                  value={newMajorName}
                  onChange={(e) => setNewMajorName(e.target.value)}
                  aria-label="New major name"
                />
              </div>
              <Button 
                className="w-full"
                onClick={handleAddMajor} 
                disabled={createMajorMutation.isPending || !newMajorName.trim() || !selectedFieldId}
              >
                {createMajorMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Major
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-auto">
              {majors?.map((major) => (
                <div key={major._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{major.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {fields?.find(f => f._id === major.fieldOfStudyId)?.name || 'Unknown Field'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMajorMutation.mutate(major._id)}
                    disabled={deleteMajorMutation.isPending}
                    aria-label={`Delete ${major.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {majors?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No majors added yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
