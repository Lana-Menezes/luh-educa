export const EMAIL_MAX_LENGTH = 254;
export const NAME_MAX_LENGTH = 80;

const EMOJI_PATTERN = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;

export function containsEmoji(value: string) {
  return EMOJI_PATTERN.test(value);
}

export function stripEmojis(value: string) {
  return value.replace(/\p{Extended_Pictographic}|\p{Emoji_Presentation}/gu, "");
}

export function rejectEmojiInput(
  event: Pick<InputEvent, "data"> & { preventDefault: () => void },
) {
  if (event.data && containsEmoji(event.data)) {
    event.preventDefault();
  }
}

export function normalizeEmail(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .slice(0, EMAIL_MAX_LENGTH);
}
