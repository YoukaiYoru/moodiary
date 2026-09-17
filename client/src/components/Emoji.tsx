type EmojiProps = {
  emoji: string;
  size?: number;
};

const emojiMap: Record<string, string> = {
  "hugging-face": "🤗",
  "grinning-face-with-smiling-eyes": "😄",
  "anxious-face-with-sweat": "😰",
  "crying-face": "😢",
  "relieved-face": "😌",
  "angry-face": "😠",
  "neutral-face": "😐",
};

export default function Emoji({ emoji, size }: EmojiProps) {
  return (
    <span
      role="img"
      aria-label={emoji}
      style={size ? { fontSize: `${size}px`, lineHeight: 1 } : undefined}
    >
      {emojiMap[emoji] ?? emoji}
    </span>
  );
}
