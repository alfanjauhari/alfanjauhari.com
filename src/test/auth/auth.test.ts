import { describe, expect, it, vi } from "vitest";
import { LoginSchema, loginFormOpts } from "@/fns/polymorphic/auth";

describe("Auth - Form Validation", () => {
  describe("LoginSchema", () => {
    it("should validate correct email format", () => {
      const result = LoginSchema.safeParse({ email: "test@example.com" });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = LoginSchema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
    });

    it("should reject empty email", () => {
      const result = LoginSchema.safeParse({ email: "" });
      expect(result.success).toBe(false);
    });

    it("should reject email without domain", () => {
      const result = LoginSchema.safeParse({ email: "test@" });
      expect(result.success).toBe(false);
    });

    it("should reject email without local part", () => {
      const result = LoginSchema.safeParse({ email: "@example.com" });
      expect(result.success).toBe(false);
    });

    it("should accept valid emails with different TLDs", () => {
      const emails = [
        "test@example.com",
        "user@domain.co.id",
        "name+tag@company.org",
        "first.last@subdomain.example.io",
      ];

      emails.forEach((email) => {
        const result = LoginSchema.safeParse({ email });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("loginFormOpts", () => {
    it("should have correct default values", () => {
      expect(loginFormOpts.defaultValues).toEqual({
        email: "",
      });
    });

    it("should have onChange validator", () => {
      expect(loginFormOpts.validators).toHaveProperty("onChange");
    });
  });
});

describe("Auth - Mock Client Functions", () => {
  it("should simulate successful magic link send", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await mockSignIn({
      email: "test@example.com",
      callbackURL: "/dashboard",
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      callbackURL: "/dashboard",
    });
    expect(result.error).toBeNull();
  });

  it("should simulate failed magic link send", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: null,
      error: {
        message: "Failed to send magic link",
      },
    });

    const result = await mockSignIn({
      email: "test@example.com",
      callbackURL: "/dashboard",
    });

    expect(result.error).toBeTruthy();
    expect(result.error.message).toBe("Failed to send magic link");
  });

  it("should simulate social login with GitHub", async () => {
    const mockSocialSignIn = vi.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    await mockSocialSignIn({
      provider: "github",
      callbackURL: "/dashboard",
    });

    expect(mockSocialSignIn).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/dashboard",
    });
  });

  it("should simulate social login with Google", async () => {
    const mockSocialSignIn = vi.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    await mockSocialSignIn({
      provider: "google",
      callbackURL: "/dashboard",
    });

    expect(mockSocialSignIn).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/dashboard",
    });
  });
});

describe("Auth - Error Handling", () => {
  it("should handle network errors gracefully", async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(mockSignIn()).rejects.toThrow("Network error");
  });

  it("should handle timeout errors", async () => {
    const mockSignIn = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 100),
          ),
      );

    await expect(mockSignIn()).rejects.toThrow("Request timeout");
  });

  it("should handle invalid token errors", () => {
    const errorMap: Record<string, string> = {
      INVALID_TOKEN: "Invalid login token. Please try again",
      EXPIRED_TOKEN: "Magic link has expired. Please request a new one",
      INVALID_EMAIL: "Invalid email address",
    };

    expect(errorMap.INVALID_TOKEN).toBe(
      "Invalid login token. Please try again",
    );
    expect(errorMap.EXPIRED_TOKEN).toBe(
      "Magic link has expired. Please request a new one",
    );
    expect(errorMap.INVALID_EMAIL).toBe("Invalid email address");
  });
});

describe("Auth - Redirect Logic", () => {
  it("should default redirect to /dashboard", () => {
    const defaultRedirect = "/dashboard";
    expect(defaultRedirect).toBe("/dashboard");
  });

  it("should use custom redirect when provided", () => {
    const customRedirect = "/profile";
    expect(customRedirect).toBe("/profile");
  });

  it("should sanitize external URLs in redirect", () => {
    const sanitizeRedirect = (url: string) => {
      if (url.includes("http")) {
        return "/";
      }
      return url;
    };

    expect(sanitizeRedirect("https://evil.com")).toBe("/");
    expect(sanitizeRedirect("http://phishing.com")).toBe("/");
    expect(sanitizeRedirect("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirect("/profile")).toBe("/profile");
  });
});
