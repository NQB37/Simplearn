'use client';

import { Fragment, useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ShiftDefinition {
  shiftId: number;
  startTime: string;
  endTime: string;
}

export interface GridCell {
  free: boolean;
  classId?: string;
  classCode?: string;
  subjectName?: string;
}

export interface TimeGridProps {
  /** Selected [dayOfWeek, shiftId] tuples */
  selected: Array<[number, number]>;
  onChange: (selected: Array<[number, number]>) => void;
  /** Busy slots from backend: grid[dayOfWeek][shiftId] */
  busyGrid?: Record<number, Record<number, GridCell>>;
  shifts: ShiftDefinition[];
  days?: number[]; // Monday=1 through Friday=5
  disabled?: boolean;
}

const DAY_LABELS: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
};

export function TimeGrid({
  selected,
  onChange,
  busyGrid = {},
  shifts,
  days = [1, 2, 3, 4, 5],
  disabled = false,
}: TimeGridProps) {
  const isDragging = useRef(false);
  const dragAction = useRef<'select' | 'deselect'>('select');

  const selectedSet = new Set(selected.map(([d, s]) => `${d}-${s}`));

  const isBusy = useCallback(
    (day: number, shiftId: number) => {
      return busyGrid[day]?.[shiftId]?.free === false;
    },
    [busyGrid],
  );

  const isSelected = useCallback(
    (day: number, shiftId: number) => {
      return selectedSet.has(`${day}-${shiftId}`);
    },
    [selectedSet],
  );

  const toggleSlot = useCallback(
    (day: number, shiftId: number, action: 'select' | 'deselect') => {
      if (isBusy(day, shiftId) || disabled) return;
      if (action === 'select' && !selectedSet.has(`${day}-${shiftId}`)) {
        onChange([...selected, [day, shiftId]]);
      } else if (action === 'deselect' && selectedSet.has(`${day}-${shiftId}`)) {
        onChange(selected.filter(([d, s]) => !(d === day && s === shiftId)));
      }
    },
    [isBusy, disabled, selectedSet, selected, onChange],
  );

  const handleMouseDown = (day: number, shiftId: number) => {
    if (isBusy(day, shiftId) || disabled) return;
    isDragging.current = true;
    dragAction.current = isSelected(day, shiftId) ? 'deselect' : 'select';
    toggleSlot(day, shiftId, dragAction.current);
  };

  const handleMouseEnter = (day: number, shiftId: number) => {
    if (!isDragging.current) return;
    toggleSlot(day, shiftId, dragAction.current);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const getBusyLabel = (day: number, shiftId: number) => {
    const cell = busyGrid[day]?.[shiftId];
    if (!cell || cell.free) return null;
    return cell.subjectName ?? cell.classCode ?? 'Busy';
  };

  return (
    <div
      className='select-none'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid: 6 cols (header + 5 days), rows per shift + 1 header */}
      <div
        className='grid border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-xs'
        style={{ gridTemplateColumns: `120px repeat(${days.length}, 1fr)` }}
      >
        {/* Header row */}
        <div className='p-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-500 dark:text-slate-400 border-b border-r border-slate-200 dark:border-slate-700 text-center'>
          Shift / Day
        </div>
        {days.map((day) => (
          <div
            key={day}
            className='p-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700 text-center last:border-r-0'
          >
            {DAY_LABELS[day]}
          </div>
        ))}

        {/* Shift rows */}
        {shifts.map((shift) => (
          <Fragment key={shift.shiftId}>
            {/* Shift label */}
            <div
              className='p-2 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-r border-slate-200 dark:border-slate-700 last:border-b-0'
            >
              <div className='font-medium'>Shift {shift.shiftId}</div>
              <div className='text-slate-400 dark:text-slate-500'>
                {shift.startTime} - {shift.endTime}
              </div>
            </div>
            {/* Day cells */}
            {days.map((day) => {
              const busy = isBusy(day, shift.shiftId);
              const sel = isSelected(day, shift.shiftId);
              const busyLabel = getBusyLabel(day, shift.shiftId);

              return (
                <div
                  key={`${day}-${shift.shiftId}`}
                  title={busy ? busyLabel ?? undefined : undefined}
                  onMouseDown={() => handleMouseDown(day, shift.shiftId)}
                  onMouseEnter={() => handleMouseEnter(day, shift.shiftId)}
                  className={cn(
                    'p-1.5 border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-h-[48px] flex items-center justify-center transition-colors',
                    busy
                      ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-400'
                      : sel
                        ? 'bg-blue-500 dark:bg-blue-600 cursor-pointer text-white font-medium'
                        : disabled
                          ? 'bg-white dark:bg-slate-950 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer',
                  )}
                >
                  {busy && busyLabel ? (
                    <span className='text-center leading-tight truncate max-w-full px-0.5'>
                      {busyLabel}
                    </span>
                  ) : sel ? (
                    <span className='text-white text-xs'>Selected</span>
                  ) : null}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
