import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import Reactions from "./Reactions";

type Message = {
  id: string;
  room_id: string;
  content: string;
  username: string;
  user_id: string;
  inserted_at: string;
};

type Props = {
  roomId: string;
  currentUser: { id: string };
};

export default function MessageList({ roomId, currentUser }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("inserted_at", { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", table: "messages", schema: "public" },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.room_id === roomId) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="space-y-2 h-96 overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800"
    >
      {messages.map((msg) => {
        const isOwn = msg.user_id === currentUser.id;
        return (
          <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-2 rounded-md max-w-xs break-words shadow-sm ${
                isOwn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-xs font-semibold mb-1">{msg.username}</p>
              <p className="text-sm">{msg.content}</p>
              <Reactions messageId={msg.id} currentUser={currentUser} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
