"use client";

import { useSession } from "@supabase/auth-helpers-react";
import ChatRoom from "@/components/ChatRoom";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session === undefined) {
    // Session is loading
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    // Not logged in, redirect to login page
    router.push("/login");
    return null;
  }

  const user = {
    id: session.user.id,
    username: session.user.user_metadata?.full_name || session.user.email,
  };

  return <ChatRoom roomId="public-room" currentUser={user} />;
}
