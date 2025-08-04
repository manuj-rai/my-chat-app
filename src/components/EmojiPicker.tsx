"use client";

import { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";

export default function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [show, setShow] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !pickerRef.current) return;

    // Clear previous picker if it exists
    pickerRef.current.innerHTML = "";

    // Dynamically load emoji-mart picker
    import("emoji-mart").then((module: any) => {
      const Picker = module.Picker;
      const picker = new Picker({
        parent: pickerRef.current,
        data,
        theme: "light",
        onEmojiSelect: (emoji: any) => {
          onSelect(emoji.native);
          setShow(false);
        },
      });
    });
  }, [show]);

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)}>😊</button>
      {show && (
        <div ref={pickerRef} className="absolute z-50 bg-white border rounded shadow" />
      )}
    </div>
  );
}
