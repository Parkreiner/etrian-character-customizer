import { expect, it, describe, test } from "vitest";
import { HSVColor, RGBColor } from "./localTypes";

// Not testing hsvToHex right now; it's currently just composed of hsvToRgb and
// rgbToHex
import {
  hexToRgb,
  rgbToHsv,
  rgbToHex,
  hsvToRgb,
  wrapHue,
} from "./colorHelpers";

describe(hexToRgb.name, () => {
  it("Should convert any seven-character hex string into a valid RGB object", () => {
    const samples = [
      ["#000000", { red: 0, green: 0, blue: 0 }],
      ["#ff0000", { red: 255, green: 0, blue: 0 }],
      ["#ff00ff", { red: 255, green: 0, blue: 255 }],
    ] as const satisfies readonly (readonly [string, RGBColor])[];

    for (const [hexString, rgbValue] of samples) {
      const result = hexToRgb(hexString) as unknown;
      expect(result).toEqual(rgbValue);
    }

    expect.hasAssertions();
  });

  it("Should be case-insensitive", () => {
    const samples = [
      ["#ffffff", { red: 255, green: 255, blue: 255 }],
      ["#FFFFFF", { red: 255, green: 255, blue: 255 }],
    ] as const satisfies readonly (readonly [string, RGBColor])[];

    for (const [hexString, rgbValue] of samples) {
      const result = hexToRgb(hexString) as unknown;
      expect(result).toEqual(rgbValue);
    }

    expect.hasAssertions();
  });

  it("Should throw for any other string arguments (including 'shorthand' hex strings)", () => {
    const sampleInputs = ["Kitty", "Birdo", "#000", "#aaa", "#AAA", "#ff00f"];

    for (const input of sampleInputs) {
      expect(() => hexToRgb(input)).toThrow();
    }

    expect.hasAssertions();
  });
});

describe(rgbToHsv.name, () => {
  it("Should be able to translate RGB values to any major segment on the hue wheel (segments each span 60 degrees)", () => {
    const samples = [
      [
        // Pure black
        { red: 0, green: 0, blue: 0 },
        { hue: 0, sat: 0, val: 0 },
      ],
      [
        // Pure red
        { red: 255, green: 0, blue: 0 },
        { hue: 0, sat: 100, val: 100 },
      ],
      [
        // Pure yellow
        { red: 255, green: 255, blue: 0 },
        { hue: 60, sat: 100, val: 100 },
      ],
      [
        // Pure green
        { red: 0, green: 255, blue: 0 },
        { hue: 120, sat: 100, val: 100 },
      ],
      [
        // Pure cyan
        { red: 0, green: 255, blue: 255 },
        { hue: 180, sat: 100, val: 100 },
      ],
      [
        // Pure blue
        { red: 0, green: 0, blue: 255 },
        { hue: 240, sat: 100, val: 100 },
      ],
      [
        // Pure magenta
        { red: 255, green: 0, blue: 255 },
        { hue: 300, sat: 100, val: 100 },
      ],
      [
        // Pure white
        { red: 255, green: 255, blue: 255 },
        { hue: 0, sat: 0, val: 100 },
      ],
    ] as const satisfies readonly (readonly [RGBColor, HSVColor])[];

    for (const [rgb, hsv] of samples) {
      expect(rgbToHsv(rgb)).toEqual(hsv);
    }

    expect.hasAssertions();
  });

  test("Process should be lossy (different RGB values can produce the same HSV value)", () => {
    const rgb1: RGBColor = { red: 250, green: 250, blue: 250 };
    const rgb2: RGBColor = { red: 251, green: 250, blue: 250 };

    expect(rgbToHsv(rgb1)).toEqual(rgbToHsv(rgb2));
  });

  test("Whenever R, G, and B values are the same, hue and saturation should both be 0", () => {
    const resultControl = { hue: 0, sat: 0 };

    for (let i = 0; i <= 255; i++) {
      const result = rgbToHsv({ red: i, green: i, blue: i });
      expect(result).toMatchObject(resultControl);
    }

    expect.hasAssertions();
  });

  it("Should work with a randomly-generated selection of RGB colors (verified with Adobe/Rags Gardner)", () => {
    const samples = [
      [
        { red: 140, green: 130, blue: 15 },
        { hue: 55, sat: 89, val: 55 },
      ],
      [
        { red: 171, green: 155, blue: 145 },
        { hue: 23, sat: 15, val: 67 },
      ],
      [
        // Adobe's tools say that the HSV should be (121, 43, 25), but I'm not
        // sure if they're doing anything special with their floats to minimize
        // rounding issues. Other tools gave the below result, though
        { red: 36, green: 64, blue: 37 },
        { hue: 122, sat: 44, val: 25 },
      ],
      [
        { red: 28, green: 103, blue: 115 },
        { hue: 188, sat: 76, val: 45 },
      ],
      [
        { red: 245, green: 240, blue: 255 },
        { hue: 260, sat: 6, val: 100 },
      ],
      [
        { red: 235, green: 38, blue: 198 },
        { hue: 311, sat: 84, val: 92 },
      ],
      [
        { red: 252, green: 254, blue: 255 },
        { hue: 200, sat: 1, val: 100 },
      ],
    ] as const satisfies readonly (readonly [RGBColor, HSVColor])[];

    for (const [rgb, hsv] of samples) {
      expect(rgbToHsv(rgb)).toEqual(hsv);
    }

    expect.hasAssertions();
  });
});

describe(rgbToHex.name, () => {
  it("Should produce strings of the pattern #hhhhhh, where each hex character is in the class [0-9a-f]", () => {
    const matcher = /^#[0-9a-f]{6}$/;

    for (let i = 0; i < 100; i++) {
      const randomized = {
        red: Math.round(Math.random() * 255),
        green: Math.round(Math.random() * 255),
        blue: Math.round(Math.random() * 255),
      };

      const result = rgbToHex(randomized);
      expect(result).toHaveLength(7);
      expect(result).toMatch(matcher);
    }

    expect.hasAssertions();
  });

  it("Should clamp values that fall outside the range 0-255, and default to 0 for invalid numbers", () => {
    let input = { red: 255, green: 255, blue: 275 };
    let result = rgbToHex(input);
    expect(result).toBe("#ffffff");

    input = { red: -1, green: -57, blue: 4000 };
    result = rgbToHex(input);
    expect(result).toBe("#0000ff");

    input = { red: Infinity, green: -Infinity, blue: NaN };
    result = rgbToHex(input);
    expect(result).toBe("#000000");
  });
});

describe(hsvToRgb.name, () => {
  test("Process should be lossy (multiple HSV values can produce the same RGB value)", () => {
    const hsv1: HSVColor = { hue: 217, sat: 89, val: 5 };
    const hsv2: HSVColor = { hue: 218, sat: 89, val: 5 };

    expect(hsvToRgb(hsv1)).toEqual(hsvToRgb(hsv2));
    expect.hasAssertions();
  });

  test("If saturation is 0, the value of hue has no effect on calculations", () => {
    const baseRgb = hsvToRgb({ hue: 0, sat: 0, val: 0 });
    const hsvSamples = [
      { hue: 60, sat: 0, val: 0 },
      { hue: 120, sat: 0, val: 0 },
      { hue: 180, sat: 0, val: 0 },
      { hue: 240, sat: 0, val: 0 },
      { hue: 300, sat: 0, val: 0 },
    ] as const satisfies readonly HSVColor[];

    for (const sample of hsvSamples) {
      expect(hsvToRgb(sample)).toEqual(baseRgb);
    }

    expect.hasAssertions();
  });

  it("Should work with a random sample of values", () => {
    const samples = [
      [
        { hue: 96, sat: 89, val: 27 },
        { red: 32, green: 69, blue: 8 },
      ],
      [
        { hue: 146, sat: 75, val: 83 },
        { red: 53, green: 212, blue: 122 },
      ],
      [
        { hue: 244, sat: 29, val: 89 },
        { red: 166, green: 161, blue: 227 },
      ],
      [
        { hue: 34, sat: 100, val: 82 },
        { red: 209, green: 118, blue: 0 },
      ],
      [
        { hue: 0, sat: 100, val: 100 },
        { red: 255, green: 0, blue: 0 },
      ],
      [
        { hue: 55, sat: 0, val: 0 },
        { red: 0, green: 0, blue: 0 },
      ],
      [
        { hue: 309, sat: 93, val: 98 },
        { red: 250, green: 17, blue: 215 },
      ],
    ] as const satisfies readonly (readonly [HSVColor, RGBColor])[];

    for (const [hsv, rgb] of samples) {
      expect(hsvToRgb(hsv)).toEqual(rgb);
    }

    expect.hasAssertions();
  });
});

describe(wrapHue.name, () => {
  it("should have no effect on values that don't need wrapping", () => {
    expect(wrapHue(20)).toBe(20);
    expect(wrapHue(359)).toBe(359);
    expect(wrapHue(181)).toBe(181);
  });

  it("should wrap integers that exceed 359 degrees (multiple times if necessary)", () => {
    expect(wrapHue(360)).toBe(0);
    expect(wrapHue(720)).toBe(0);
    expect(wrapHue(547)).toBe(187);
    expect(wrapHue(496)).toBe(136);
  });

  it("should wrap integers that fall below 0 degrees (multiple times if necessary)", () => {
    expect(wrapHue(-1)).toBe(359);
    expect(wrapHue(-720)).toBe(0);
  });

  it("should wrap decimal values, but not truncate them into integers", () => {
    const input = 187.3871;
    const wrapped = wrapHue(input);
    const epsilon = 0.00001;

    expect(Math.trunc(wrapped)).toBe(187);
    expect(wrapped - input).toBeLessThanOrEqual(epsilon);
  });

  it("should have no special behaviors for NaN values (that should be a concern for the consumer)", () => {
    expect(wrapHue(NaN)).toBeNaN();
  });
});
