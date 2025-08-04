'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  roomId: string;
  currentUser: { id: string; username: string };
};

export default function TypingIndicator({ roomId, currentUser }: Props) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: { key: currentUser.id },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const others = Object.entries(state)
          .filter(([userId]) => userId !== currentUser.id)
          .flatMap(([_, presences]: any) => presences.map((p: any) => p.username));
        setTypingUsers(others);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ username: currentUser.username, typing: false });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, currentUser]);

  return (
    <div className="text-sm text-gray-500 h-5 min-h-[1rem]">
      {typingUsers.length > 0 &&
        `${typingUsers.join(', ')} ${typingUsers.length > 1 ? 'are' : 'is'} typing...`}
    </div>
  );
}
