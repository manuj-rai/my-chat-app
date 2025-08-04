'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import EmojiPicker from './EmojiPicker';
import type { RealtimeChannel } from '@supabase/supabase-js';

type Props = {
  roomId: string;
  currentUser: { id: string; username: string };
  onTyping: (typing: boolean) => void;
};

export default function MessageInput({ roomId, currentUser, onTyping }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ch = supabase.channel(`room:${roomId}`, {
      config: { presence: { key: currentUser.id } },
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ username: currentUser.username, typing: false });
      }
    });

    setChannel(ch);
    return () => {
      supabase.removeChannel(ch);
    };
  }, [roomId, currentUser]);

  const handleTyping = () => {
    if (!channel) return;

    onTyping(true);
    channel.track({ username: currentUser.username, typing: true });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      channel.track({ username: currentUser.username, typing: false });
      onTyping(false);
    }, 2000);
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await supabase.from('messages').insert({
      content: trimmed,
      user_id: currentUser.id,
      username: currentUser.username,
      room_id: roomId,
    });

    setText('');
    channel?.track({ username: currentUser.username, typing: false });
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        ref={inputRef}
        type="text"
        className="flex-1 border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
        value={text}
        placeholder="Type your message..."
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            onTyping(false);
          }
        }}
      />
      <EmojiPicker onSelect={(emoji: string) => setText((prev) => prev + emoji)} />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          sendMessage();
          onTyping(false);
        }}
      >
        Send
      </button>
    </div>
  );
}
