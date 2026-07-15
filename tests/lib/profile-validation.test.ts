import { describe, expect, it } from "vitest";
import { getProfileValidationErrors } from "../../src/lib/profile-validation";

describe("getProfileValidationErrors", () => {
  it("requires a non-empty display name", () => {
    expect(getProfileValidationErrors({ name: "   ", email: "user@example.com" })).toEqual({
      name: "Informe seu nome.",
    });
  });

  it("rejects invalid email addresses", () => {
    expect(getProfileValidationErrors({ name: "Maria", email: "invalid" })).toEqual({
      email: "Informe um e-mail válido.",
    });
  });

  it("validates a new password when one is provided", () => {
    expect(getProfileValidationErrors({ name: "Maria", email: "user@example.com", newPassword: "abc" })).toEqual({
      newPassword: "A senha precisa ter pelo menos 8 caracteres.",
    });
  });

  it("accepts a complete profile", () => {
    expect(getProfileValidationErrors({ name: "Maria", email: "user@example.com", newPassword: "Abcdefg1" })).toEqual({});
  });
});
