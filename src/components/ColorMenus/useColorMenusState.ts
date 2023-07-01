import { useCallback, useReducer } from "react";
import { clamp } from "@/utils/math";
import { CharacterColors, ColorCategory } from "@/typesConstants/colors";
import { UiTab } from "./localTypes";

type CategoryIndices = {
  [key in ColorCategory]: key extends "misc" ? number : 0 | 1;
};

type MenusState = {
  activeTab: UiTab;
  activeCategory: ColorCategory;
  activeIndices: CategoryIndices;

  /**
   * Used to help the app remember which eye was last selected (left or right)
   * if the user navigates to a different tab.
   */
  lastEyeSelection: "leftEye" | "rightEye";

  /**
   * Dynamic list of booleans indicating which pairs of colors between the
   * left and right eyes currently have their state changes synced.
   *
   * (e.g., If index 0 is true, when changing left eye 1 will also change right
   * eye 1. If it's false, changing left eye 1 updates only the left eye, unless
   * the user is choosing a preset in some cases)
   */
  eyeLinkStatuses: readonly boolean[];
};

type MenusAction =
  | { type: "tabChanged"; payload: { newTab: UiTab } }
  | { type: "eyeLinkToggled"; payload: { linkIndex: number } }
  | {
      type: "newColorFillSelected";
      payload:
        | { newCategory: Exclude<ColorCategory, "misc">; newIndex: 0 | 1 }
        | { newCategory: "misc"; newIndex: number };
    };

// Excludes eyeLinkStatuses because that has to be derived from the colors
// being fed into the component instance
const initialStateTemplate = {
  activeTab: "skin",
  activeCategory: "skin",
  lastEyeSelection: "leftEye",

  activeIndices: {
    skin: 0,
    hair: 0,
    leftEye: 0,
    rightEye: 0,
    misc: 0,
  },
} as const satisfies Omit<MenusState, "eyeLinkStatuses">;

export function reduceMenusState(
  state: MenusState,
  action: MenusAction
): MenusState {
  switch (action.type) {
    case "tabChanged": {
      const { newTab } = action.payload;
      const newCategory = newTab === "eyes" ? state.lastEyeSelection : newTab;

      return {
        ...state,
        activeTab: newTab,
        activeCategory: newCategory,
      };
    }

    case "newColorFillSelected": {
      const { newCategory, newIndex } = action.payload;
      const skipUpdate =
        newCategory === state.activeCategory &&
        newIndex === state.activeIndices[state.activeCategory];

      if (skipUpdate) return state;

      const updateForEyes =
        newCategory === "leftEye" || newCategory === "rightEye";

      // This part should be redundant with how the UI is set up, but it doesn't
      // hurt to be thorough.
      const newTab = updateForEyes ? "eyes" : newCategory;
      const newLastSelection = updateForEyes
        ? newCategory
        : state.lastEyeSelection;

      return {
        ...state,
        activeCategory: newCategory,
        activeTab: newTab,
        lastEyeSelection: newLastSelection,
        activeIndices: { ...state.activeIndices, [newCategory]: newIndex },
      };
    }

    case "eyeLinkToggled": {
      const { linkIndex } = action.payload;
      const prevLink = state.eyeLinkStatuses[linkIndex];

      const linkCopy = [...state.eyeLinkStatuses];
      linkCopy[linkIndex] = prevLink === undefined ? false : !prevLink;

      return {
        ...state,
        eyeLinkStatuses: linkCopy,
      };
    }
  }
}

export default function useColorMenusState(colors: CharacterColors) {
  const [state, dispatch] = useReducer(reduceMenusState, null, () => {
    const eyeLinkStatuses = colors.leftEye.map(() => true);
    return { ...initialStateTemplate, eyeLinkStatuses };
  });

  const changeSelectedFill = useCallback(
    (newCategory: ColorCategory, newIndex: number) => {
      if (newCategory === "misc") {
        const normalized =
          Number.isInteger(newIndex) && newIndex >= 0 ? newIndex : 0;
        const clamped = clamp(normalized, 0, colors.misc.length);

        return dispatch({
          type: "newColorFillSelected",
          payload: { newCategory, newIndex: clamped },
        });
      }

      if (newIndex === 0 || newIndex === 1) {
        dispatch({
          type: "newColorFillSelected",
          payload: { newCategory, newIndex },
        });
      }
    },
    [colors.misc.length]
  );

  const changeTab = useCallback((newTab: UiTab) => {
    dispatch({ type: "tabChanged", payload: { newTab } });
  }, []);

  const toggleEyeLink = useCallback((linkIndex: number) => {
    dispatch({ type: "eyeLinkToggled", payload: { linkIndex } });
  }, []);

  return {
    state,
    updaters: {
      changeSelectedFill,
      changeTab,
      toggleEyeLink,
    },
  } as const;
}
