import { describe, expect, it } from "vitest";
import { getPasswordValidationError } from "../../src/lib/password-policy";

describe("getPasswordValidationError", () => {
  it("requires eight characters, uppercase, lowercase, and number", () => {
    expect(getPasswordValidationError("abc")).toBe("A senha precisa ter pelo menos 8 caracteres.");
    expect(getPasswordValidationError("abcdefgh")).toBe("A senha precisa ter uma letra maiúscula.");
    expect(getPasswordValidationError("Abcdefgh")).toBe("A senha precisa ter um número.");
    expect(getPasswordValidationError("Abcdefg1")).toBe("");
  });
});
