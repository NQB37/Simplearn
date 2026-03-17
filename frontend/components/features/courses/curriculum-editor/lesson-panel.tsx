'use client';

import * as React from 'react';
import { FileText, Download, Type, ImageIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/ui/editor';
import { ContentBlock, Lesson } from '@/types/course.type';
import { useLessonMutations } from '@/hooks/use-courses';
import {
  useImageUpload,
  useImageDelete,
  useDocumentUpload,
  useDocumentDelete,
} from '@/hooks/use-media';
import { mediaService } from '@/lib/services/media.service';
import { formatBytes } from './utils';

interface LessonPanelProps {
  lesson: Lesson;
  courseId: string;
  moduleId: string;
}

export function LessonPanel({ lesson, courseId, moduleId }: LessonPanelProps) {
  const [localContents, setLocalContents] = React.useState<ContentBlock[]>(
    lesson.contents,
  );
  // Tracks Cloudinary publicIds for newly uploaded images (not persisted, for deletion only)
  const [editingPublicIds, setEditingPublicIds] = React.useState<
    Record<string, string>
  >({});

  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const documentInputRef = React.useRef<HTMLInputElement>(null);

  const { updateMutation } = useLessonMutations(courseId, moduleId);
  const imageUploadMutation = useImageUpload();
  const imageDeleteMutation = useImageDelete();
  const documentUploadMutation = useDocumentUpload();
  const documentDeleteMutation = useDocumentDelete();

  // Sync localContents only when the lesson identity changes (initial load or different lesson)
  // NOT on every refetch — TanStack Query returns a new array reference each time even if
  // contents are identical, which would wipe unsaved blocks the user just added.
  React.useEffect(() => {
    setLocalContents(lesson.contents);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson._id]);

  function updateBlock(blockId: string, patch: Partial<ContentBlock>) {
    setLocalContents((prev) =>
      prev.map((b) =>
        b._id === blockId ? ({ ...b, ...patch } as ContentBlock) : b,
      ),
    );
  }

  function removeBlock(blockId: string) {
    const block = localContents.find((b) => b._id === blockId);
    if (block?.type === 'image') {
      const publicId = editingPublicIds[blockId];
      if (publicId) {
        imageDeleteMutation.mutate(publicId);
        setEditingPublicIds((prev) => {
          const updated = { ...prev };
          delete updated[blockId];
          return updated;
        });
      }
    } else if (block?.type === 'document') {
      documentDeleteMutation.mutate(block.path);
    }
    setLocalContents((prev) => prev.filter((b) => b._id !== blockId));
  }

  function handleAddText() {
    const newBlock: ContentBlock = {
      _id: crypto.randomUUID(),
      type: 'text',
      body: '',
    };
    setLocalContents((prev) => [...prev, newBlock]);
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    imageUploadMutation.mutate(file, {
      onSuccess: (result) => {
        const newId = crypto.randomUUID();
        const newBlock: ContentBlock = {
          _id: newId,
          type: 'image',
          url: result.url,
          altText: '',
        };
        setLocalContents((prev) => [...prev, newBlock]);
        setEditingPublicIds((prev) => ({ ...prev, [newId]: result.publicId }));
      },
    });
  }

  function handleDocumentFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    documentUploadMutation.mutate(file, {
      onSuccess: (result) => {
        const newBlock: ContentBlock = {
          _id: crypto.randomUUID(),
          type: 'document',
          path: result.path,
          fullPath: result.fullPath,
          originalName: result.originalName,
          size: result.size,
          mimeType: result.mimeType,
        };
        setLocalContents((prev) => [...prev, newBlock]);
      },
    });
  }

  async function handleDownloadDocument(path: string) {
    const result = await mediaService.getDocumentUrl(path);
    window.open(result.signedUrl, '_blank');
  }

  function handleSave() {
    // Strip _id before sending: crypto.randomUUID() produces UUIDs which are not valid
    // MongoDB ObjectIds and cause Mongoose CastErrors. Server assigns real _id on save.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const contentsToSave = localContents.map(({ _id, ...rest }) => rest);
    updateMutation.mutate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { lessonId: lesson._id, data: { contents: contentsToSave as any } },
      {
        onSuccess: (savedLesson) => {
          // Sync so server-assigned ObjectId _id values replace our temporary UUIDs
          setLocalContents(savedLesson.contents);
        },
      },
    );
  }

  const isUploading =
    imageUploadMutation.isPending || documentUploadMutation.isPending;

  return (
    <div className='border rounded-md p-4 bg-background space-y-4'>
      {/* Toolbar */}
      <div className='flex items-center gap-2 flex-wrap'>
        <Button
          size='sm'
          variant='outline'
          onClick={handleAddText}
          type='button'
        >
          <Type className='h-4 w-4 mr-1' /> Add Text
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => imageInputRef.current?.click()}
          disabled={isUploading}
          type='button'
        >
          <ImageIcon className='h-4 w-4 mr-1' /> Add Image
        </Button>
        <Button
          size='sm'
          variant='outline'
          onClick={() => documentInputRef.current?.click()}
          disabled={isUploading}
          type='button'
        >
          <FileText className='h-4 w-4 mr-1' /> Add Document
        </Button>
        <input
          ref={imageInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleImageFileChange}
        />
        <input
          ref={documentInputRef}
          type='file'
          accept='.pdf,.doc,.docx,.ppt,.pptx'
          className='hidden'
          onChange={handleDocumentFileChange}
        />
      </div>

      {/* Content blocks */}
      <div className='space-y-3'>
        {localContents.length === 0 && (
          <p className='text-sm text-muted-foreground text-center py-4 italic'>
            No content yet. Use the toolbar to add blocks.
          </p>
        )}
        {localContents.map((block) => (
          <div key={block._id} className='relative border rounded-md p-3 group'>
            <Button
              size='icon'
              variant='ghost'
              className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={() => removeBlock(block._id)}
              type='button'
              aria-label='Remove block'
            >
              <X className='h-3 w-3' />
            </Button>

            {block.type === 'text' && (
              <Editor
                value={block.body}
                onChange={(v) =>
                  updateBlock(block._id, { body: v } as Partial<ContentBlock>)
                }
              />
            )}

            {block.type === 'image' && (
              <img
                src={block.url}
                alt={block.altText ?? ''}
                className='max-h-48 rounded object-contain'
              />
            )}

            {block.type === 'document' && (
              <div className='flex items-center gap-3'>
                <FileText className='h-5 w-5 text-red-500 shrink-0' />
                <div className='flex-1 min-w-0'>
                  <Input
                    value={block.originalName}
                    onChange={(e) =>
                      updateBlock(block._id, {
                        originalName: e.target.value,
                      } as Partial<ContentBlock>)
                    }
                    className='h-7 text-sm'
                  />
                  <span className='text-xs text-muted-foreground'>
                    {formatBytes(block.size)}
                  </span>
                </div>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 shrink-0'
                  onClick={() => handleDownloadDocument(block.path)}
                  type='button'
                  aria-label='Download document'
                >
                  <Download className='h-4 w-4' />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className='flex justify-end pt-2 border-t'>
        <Button
          size='sm'
          onClick={handleSave}
          disabled={updateMutation.isPending}
          type='button'
        >
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
