"use client";

import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

type Props = {
  roomId: string;
  currentUser: { id: string; username: string };
};

export default function ChatRoom({ roomId, currentUser }: Props) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Welcome, {currentUser.username}
        </h2>

        <MessageList roomId={roomId} currentUser={currentUser} />

        {/* 👤 You are typing */}
        {isTyping && (
          <div className="text-sm text-blue-500 text-right mr-2">You are typing...</div>
        )}

        {/* 🧑‍🤝‍🧑 Others typing */}
        <TypingIndicator roomId={roomId} currentUser={currentUser} />

        {/* 📩 Input */}
        <MessageInput
          roomId={roomId}
          currentUser={currentUser}
          onTyping={setIsTyping}
        />
      </div>
    </div>
  );
}
