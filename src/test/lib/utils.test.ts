import { describe, expect, it } from "vitest";
import { cn, formatDate, sleep } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
    });

    it("should merge tailwind classes correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("should handle undefined values", () => {
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date)).toBe("15/1/2024");
    });

    it("should format timestamp correctly", () => {
      const timestamp = new Date(2024, 11, 25).getTime();
      expect(formatDate(timestamp)).toBe("25/12/2024");
    });
  });

  describe("sleep", () => {
    it("should resolve after specified time", async () => {
      const start = Date.now();
      await sleep(50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(40);
    });

    it("should use default time of 1000ms", async () => {
      const start = Date.now();
      await sleep();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(990);
    }, 2000);
  });
});
