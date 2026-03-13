'use client';

import * as React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src?: string;
  thumbnail?: string;
  onEnded?: () => void;
}

export function VideoPlayer({ src, thumbnail, onEnded }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className='relative aspect-video bg-black rounded-lg overflow-hidden group'>
      {/* Using native video as placeholder, will integrate specialized player later */}
      <video
        ref={videoRef}
        src={src || 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4'}
        poster={thumbnail}
        className='w-full h-full object-contain'
        controls
        onEnded={onEnded}
      />

      {/* Custom Overlay (hidden when playing or user inactive) is complex, sticking to native for MVP */}
      {!isPlaying && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group-hover:bg-black/50 transition-colors'
          onClick={togglePlay}
        >
          <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform'>
            <Play className='h-8 w-8 text-white ml-1 fill-white' />
          </div>
        </div>
      )}
    </div>
  );
}
