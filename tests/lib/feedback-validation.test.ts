import { describe, expect, it } from "vitest";
import { validateFeedbackPayload } from "../../src/lib/feedback-validation";

describe("validateFeedbackPayload", () => {
  it("accepts a message with a supported image under the size limit", () => {
    const result = validateFeedbackPayload("A plataforma ficou muito boa", {
      type: "image/png",
      size: 1024,
    });

    expect(result).toEqual({ valid: true });
  });

  it("rejects messages longer than 200 characters", () => {
    const result = validateFeedbackPayload("a".repeat(201), null);

    expect(result).toEqual({ valid: false, error: "O feedback deve ter no máximo 200 caracteres." });
  });

  it("rejects unsupported or oversized images", () => {
    expect(validateFeedbackPayload("Feedback", { type: "application/pdf", size: 1024 })).toEqual({
      valid: false,
      error: "Anexe uma imagem JPG, PNG ou WebP de até 5 MB.",
    });
    expect(validateFeedbackPayload("Feedback", { type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toEqual({
      valid: false,
      error: "Anexe uma imagem JPG, PNG ou WebP de até 5 MB.",
    });
  });
});
