import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  messageId: string;
  currentUser: { id: string };
};

export default function Reactions({ messageId, currentUser }: Props) {
  const [reactions, setReactions] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchReactions = async () => {
      const { data } = await supabase
        .from("message_reactions")
        .select("emoji")
        .eq("message_id", messageId);

      const counts = data?.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) ?? {};

      setReactions(counts);
    };

    fetchReactions();
  }, [messageId]);

  const handleReact = async (emoji: string) => {
    await supabase.from("message_reactions").upsert({
      message_id: messageId,
      user_id: currentUser.id,
      emoji,
    });
  };

  return (
    <div className="flex gap-1 text-sm mt-1">
      {Object.entries(reactions).map(([emoji, count]) => (
        <button key={emoji} onClick={() => handleReact(emoji)}>
          {emoji} {count}
        </button>
      ))}
      <button onClick={() => handleReact("❤️")}>❤️</button>
      <button onClick={() => handleReact("😂")}>😂</button>
    </div>
  );
}
