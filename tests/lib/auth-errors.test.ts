import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "../../src/lib/auth-errors";

describe("getAuthErrorMessage", () => {
  it("translates Firebase credential errors to Portuguese", () => {
    expect(getAuthErrorMessage("auth/invalid-credential")).toBe("E-mail ou senha inválidos.");
  });

  it("uses a safe fallback for unknown Firebase errors", () => {
    expect(getAuthErrorMessage("auth/unknown")).toBe("Não foi possível concluir a solicitação. Tente novamente.");
  });
});
