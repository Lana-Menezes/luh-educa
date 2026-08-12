export const EMAIL_MAX_LENGTH = 254;
export const NAME_MAX_LENGTH = 80;
export const PASSWORD_MAX_LENGTH = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMOJI_PATTERN = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;

export type AuthFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

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

export function readPassword(value: unknown): string {
  return String(value ?? "");
}

export function validateLoginCredentials(
  email: string,
  password: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!email) {
    errors.email = "Informe o e-mail.";
  } else if (
    containsEmoji(email) ||
    email.length > EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(email)
  ) {
    errors.email = "Informe um e-mail válido, sem emojis.";
  }

  if (!password) {
    errors.password = "Informe a senha.";
  } else if (containsEmoji(password)) {
    errors.password = "A senha não pode conter emojis.";
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    errors.password = "Credenciais inválidas.";
  }

  return errors;
}

export function validateRegisterCredentials(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (!name) {
    errors.name = "Informe o nome.";
  } else if (containsEmoji(name)) {
    errors.name = "O nome não pode conter emojis.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = "Informe um nome mais curto.";
  }

  Object.assign(errors, validateLoginCredentials(email, password));

  if (!confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  } else if (containsEmoji(confirmPassword)) {
    errors.confirmPassword = "A senha não pode conter emojis.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem.";
  }

  return errors;
}

export function hasAuthFieldErrors(errors: AuthFieldErrors) {
  return Boolean(
    errors.name || errors.email || errors.password || errors.confirmPassword,
  );
}

export function safeInternalPath(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }
  return value;
}
