"use client";

import { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";

type Props = {
  onSelect: (emoji: string) => void;
};

export default function EmojiPicker({ onSelect }: Props) {
  const [show, setShow] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !pickerRef.current) return;

    pickerRef.current.innerHTML = "";

    import("emoji-mart").then((module) => {
      const Picker = module.Picker;
      new Picker({
        parent: pickerRef.current!,
        data,
        theme: "light",
        onEmojiSelect: (emoji: { native: string }) => {
          onSelect(emoji.native);
          setShow(false);
        },
      });
    });
  }, [show, onSelect]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="text-xl"
      >
        😊
      </button>
      {show && (
        <div
          ref={pickerRef}
          className="absolute right-0 z-50 bg-white border rounded shadow"
        />
      )}
    </div>
  );
}
