'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRooms } from '@/hooks/use-academics';
import { AddRoomModal } from './add-room-modal';
import { EditRoomModal } from './edit-room-modal';
import { DeleteRoomModal } from './delete-room-modal';

export function RoomsManager() {
  const { data: rooms = [], isLoading } = useRooms();

  return (
    <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
      <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
        <CardTitle className='text-lg font-bold'>Class Rooms</CardTitle>
        <AddRoomModal />
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left align-middle'>
            <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800'>
              <tr>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Capacity</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className='p-4 text-center'>
                    Loading...
                  </td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className='p-4 text-center'>
                    No rooms found.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group text-slate-900 dark:text-slate-100'
                  >
                    <td className='px-4 py-3 font-semibold'>{room.name}</td>
                    <td className='px-4 py-3 font-medium text-slate-500'>
                      {room.capacity} seats
                    </td>
                    <td className='px-4 py-3'>
                      <Badge
                        variant={
                          room.status === 'active' ? 'default' : 'outline'
                        }
                        className={
                          room.status === 'active'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'text-amber-600'
                        }
                      >
                        {room.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className='px-4 py-3 text-right space-x-2'>
                      <EditRoomModal room={room} />
                      <DeleteRoomModal room={room} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
