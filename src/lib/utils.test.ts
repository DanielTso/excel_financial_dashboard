import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      "base-class",
      isActive && "active-class",
      isDisabled && "disabled-class"
    );

    expect(result).toBe("base-class active-class");
  });

  it("should handle undefined and null values", () => {
    const result = cn("class1", undefined, null, "class2", false && "class3");
    expect(result).toBe("class1 class2");
  });

  it("should merge Tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    // tailwind-merge should resolve the conflict in favor of px-4
    expect(result).toBe("py-1 px-4");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle nested arrays", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle objects with clsx", () => {
    const result = cn({
      "class1": true,
      "class2": false,
      "class3": true,
    });
    expect(result).toBe("class1 class3");
  });
});
