export const feedbackCharacterLimit = 200;
export const feedbackImageSizeLimit = 5 * 1024 * 1024;
export const feedbackImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

interface FeedbackFileMetadata {
  type: string;
  size: number;
}

type FeedbackValidation = { valid: true } | { valid: false; error: string };

export function validateFeedbackPayload(message: string, file: FeedbackFileMetadata | null): FeedbackValidation {
  if (!message.trim()) return { valid: false, error: "Escreva uma mensagem antes de enviar." };
  if (message.length > feedbackCharacterLimit) return { valid: false, error: "O feedback deve ter no máximo 200 caracteres." };
  if (!file) return { valid: true };
  if (!feedbackImageTypes.includes(file.type as typeof feedbackImageTypes[number]) || file.size > feedbackImageSizeLimit) {
    return { valid: false, error: "Anexe uma imagem JPG, PNG ou WebP de até 5 MB." };
  }
  return { valid: true };
}
