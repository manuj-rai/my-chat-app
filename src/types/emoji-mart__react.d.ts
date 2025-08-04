declare module "@emoji-mart/react" {
  import { ComponentType } from "react";

  interface EmojiMartPickerProps {
    data: Data; // you can replace this with a better type if you import from @emoji-mart/data
    onEmojiSelect: (emoji: { native: string }) => void;
    theme?: "light" | "dark" | "auto";
    previewPosition?: "none" | "bottom";
    searchPosition?: "none" | "top";
    emojiButtonSize?: number;
    emojiSize?: number;
    locale?: string;
    navPosition?: "top" | "bottom";
    skinTonePosition?: "none" | "search" | "preview" | "footer";
    perLine?: number;
    [key: string]: unknown; // fallback for unknown props
  }

  export const Picker: ComponentType<EmojiMartPickerProps>;
  export default Picker;
}
