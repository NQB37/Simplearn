'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface EditorProps {
  // HTML content
  value: string;
  // Callback when content changes
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList:
          // Keep bullet list attributes
          {
            keepMarks: true,
            keepAttributes: false,
          },
        orderedList:
          // Keep ordered list attributes
          {
            keepMarks: true,
            keepAttributes: false,
          },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm dark:prose-invert max-w-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // When value changes from outside (e.g. form reset), update editor content
  // Note: Only update if content is different to avoid cursor jumping
  // React.useEffect(() => {
  //   if (editor && value !== editor.getHTML()) {
  //     editor.commands.setContent(value)
  //   }
  // }, [value, editor])

  if (!editor) {
    return null;
  }

  return (
    <div className='flex flex-col border rounded-md overflow-hidden bg-muted/10'>
      <div className='flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1'>
        <Toggle
          size='sm'
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label='Toggle Bold'
        >
          <Bold className='h-4 w-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label='Toggle Italic'
        >
          <Italic className='h-4 w-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive('strike')}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label='Toggle Strikethrough'
        >
          <Strikethrough className='h-4 w-4' />
        </Toggle>
        <div className='mx-1 w-px h-6 bg-border' />
        <Toggle
          size='sm'
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label='Toggle Heading 2'
        >
          <Heading2 className='h-4 w-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive('bulletList')}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label='Toggle Bullet List'
        >
          <List className='h-4 w-4' />
        </Toggle>
        <Toggle
          size='sm'
          pressed={editor.isActive('orderedList')}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label='Toggle Ordered List'
        >
          <ListOrdered className='h-4 w-4' />
        </Toggle>
      </div>
      <EditorContent editor={editor} className='p-2 min-h-[150px]' />
    </div>
  );
}
