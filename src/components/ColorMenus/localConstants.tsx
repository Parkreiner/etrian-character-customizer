import { UiTab } from "./localTypes";
import { TabInfo } from "../ControlsContainer";

/**
 * All tab icons courtesy of Heroicons (part of Tailwind Labs).
 * {@link https://heroicons.com/}
 */
export const tabIcons = {
  skin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M11 2a1 1 0 10-2 0v6.5a.5.5 0 01-1 0V3a1 1 0 10-2 0v5.5a.5.5 0 01-1 0V5a1 1 0 10-2 0v7a7 7 0 1014 0V8a1 1 0 10-2 0v3.5a.5.5 0 01-1 0V3a1 1 0 10-2 0v5.5a.5.5 0 01-1 0V2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  hair: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M1.469 3.75a3.5 3.5 0 005.617 4.11l.883.51c.025.092.147.116.21.043a3.75 3.75 0 01.5-.484c.286-.23.3-.709-.018-.892l-.825-.477A3.501 3.501 0 001.47 3.75zm2.03 3.482a2 2 0 112-3.464 2 2 0 01-2 3.464zM9.956 8.322a2.75 2.75 0 00-1.588 1.822L7.97 11.63l-.884.51a3.501 3.501 0 10.75 1.3l10.68-6.166a.75.75 0 00-.182-1.374l-.703-.189a2.75 2.75 0 00-1.78.123L9.955 8.322zM2.768 15.5a2 2 0 113.464-2 2 2 0 01-3.464 2z"
        clipRule="evenodd"
      />
      <path d="M12.52 11.89a.5.5 0 00.056.894l3.274 1.381a2.75 2.75 0 001.78.123l.704-.188a.75.75 0 00.18-1.374l-3.47-2.004a.5.5 0 00-.5 0L12.52 11.89z" />
    </svg>
  ),
  eyes: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path
        fillRule="evenodd"
        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  ),

  misc: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
        clipRule="evenodd"
      />
    </svg>
  ),
} as const satisfies Record<UiTab, JSX.Element>;

/**
 * Information necessary for rendering all tabs via the ControlsContainer
 * component. By default, all of these will render unconditionally. To change
 * this, each item will need a "display" property added with a value of false.
 */
export const baseTabInfo = [
  {
    value: "skin",
    labelText: "Change skin color",
    content: tabIcons.skin,
  },
  {
    value: "hair",
    labelText: "Change hair color",
    content: tabIcons.hair,
  },
  {
    value: "eyes",
    labelText: "Change eye colors",
    content: tabIcons.eyes,
  },
  {
    value: "misc",
    labelText: "Change colors for miscellaneous items",
    content: tabIcons.misc,
  },
] as const satisfies readonly TabInfo<UiTab>[];
