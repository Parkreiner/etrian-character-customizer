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
  eyeSet1Linked: boolean;
  eyeSet2Linked: boolean;
  lastEyeSelection: "leftEye" | "rightEye";
};

type MenusAction =
  | { type: "eyeSet1Toggled" }
  | { type: "eyeSet2Toggled" }
  | { type: "tabChanged"; payload: { newTab: UiTab } }
  | {
      type: "newColorFillSelected";
      payload:
        | { newCategory: Exclude<ColorCategory, "misc">; newIndex: 0 | 1 }
        | { newCategory: "misc"; newIndex: number };
    };

const initialState = {
  activeTab: "skin",
  activeCategory: "skin",
  lastEyeSelection: "leftEye",
  eyeSet1Linked: true,
  eyeSet2Linked: true,

  activeIndices: {
    skin: 0,
    hair: 0,
    leftEye: 0,
    rightEye: 0,
    misc: 0,
  },
} as const satisfies MenusState;

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

    case "eyeSet1Toggled": {
      return { ...state, eyeSet1Linked: !state.eyeSet1Linked };
    }

    case "eyeSet2Toggled": {
      return { ...state, eyeSet2Linked: !state.eyeSet2Linked };
    }
  }
}

export default function useColorMenusState(colors: CharacterColors) {
  const [state, dispatch] = useReducer(reduceMenusState, initialState);

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

  const toggleEyeLink1 = useCallback(() => {
    dispatch({ type: "eyeSet1Toggled" });
  }, []);

  const toggleEyeLink2 = useCallback(() => {
    dispatch({ type: "eyeSet2Toggled" });
  }, []);

  return {
    state,
    updaters: {
      changeSelectedFill,
      changeTab,
      toggleEyeLink1,
      toggleEyeLink2,
    },
  } as const;
}
