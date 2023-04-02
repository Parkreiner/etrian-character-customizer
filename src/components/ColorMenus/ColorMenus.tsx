import { useState } from "react";
import { clamp } from "@/utils/math";
import {
  CharacterColors,
  ColorCategory,
  ColorTuple,
} from "@/typesConstants/colors";

import * as Tabs from "@/components/Tabs";
import ColorPicker from "../ColorPicker";

type ExternalProps = {
  syncKey: string;
  colors: CharacterColors;
  onColorChange: (newColors: CharacterColors) => void;
};

type CategoryIndices = {
  [key in ColorCategory]: key extends "misc" ? number : 0 | 1;
};

type UiTab = Exclude<ColorCategory, "leftEye" | "rightEye"> | "eyes";

const initialIndices: CategoryIndices = {
  skin: 0,
  hair: 0,
  leftEye: 0,
  rightEye: 0,
  misc: 0,
};

const tabIcons = {
  skin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.591 1.59 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-1.752 4.007l-1.736 1.736a6 6 0 01-4.242 1.757H10.5a7.5 7.5 0 01-7.5-7.5V6.375a1.125 1.125 0 012.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 012.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875z" />
    </svg>
  ),
  hair: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M8.128 9.155a3.751 3.751 0 11.713-1.321l1.136.656a.75.75 0 01.222 1.104l-.006.007a.75.75 0 01-1.032.157 1.421 1.421 0 00-.113-.072l-.92-.531zm-4.827-3.53a2.25 2.25 0 013.994 2.063.756.756 0 00-.122.23 2.25 2.25 0 01-3.872-2.293zM13.348 8.272a5.073 5.073 0 00-3.428 3.57c-.101.387-.158.79-.165 1.202a1.415 1.415 0 01-.707 1.201l-.96.554a3.751 3.751 0 10.734 1.309l13.729-7.926a.75.75 0 00-.181-1.374l-.803-.215a5.25 5.25 0 00-2.894.05l-5.325 1.629zm-9.223 7.03a2.25 2.25 0 102.25 3.897 2.25 2.25 0 00-2.25-3.897zM12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
      <path d="M16.372 12.615a.75.75 0 01.75 0l5.43 3.135a.75.75 0 01-.182 1.374l-.802.215a5.25 5.25 0 01-2.894-.051l-5.147-1.574a.75.75 0 01-.156-1.367l3-1.732z" />
    </svg>
  ),
  eyes: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path
        fillRule="evenodd"
        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
        clipRule="evenodd"
      />
    </svg>
  ),

  misc: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  ),
} as const satisfies Record<UiTab, JSX.Element>;

type CoreProps = Omit<ExternalProps, "syncKey">;

function ColorMenusCore({ colors, onColorChange }: CoreProps) {
  const [activeCategory, setActiveCategory] = useState<ColorCategory>("skin");
  const [activeIndices, setActiveIndices] = useState(initialIndices);
  const [eyesLinked, setEyesLinked] = useState(true);

  const toggleLink = () => setEyesLinked((current) => !current);

  const onHexChange = (newHexColor: string) => {
    const activeIndex = activeIndices[activeCategory];
    const newTuple = colors[activeCategory].map((oldHex, index) => {
      return index === activeIndex ? newHexColor : oldHex;
    });

    const bothEyesNeedUpdate =
      eyesLinked &&
      (activeCategory === "leftEye" || activeCategory === "rightEye");

    if (bothEyesNeedUpdate) {
      // This is really ugly, but it's just a limitation of the built-in
      // Array.map method typing. It can't preserve tuple lengths
      onColorChange({
        ...colors,
        leftEye: newTuple as unknown as ColorTuple,
        rightEye: newTuple as unknown as ColorTuple,
      });
    } else {
      // I have no idea why TypeScript isn't complaining here; the operation is
      // safe, but it should be detecting that this is mixing arrays/tuples
      onColorChange({ ...colors, [activeCategory]: newTuple });
    }
  };

  const onCategoryIndexChange = (newIndex: number) => {
    if (activeCategory === "misc") {
      const normalized = Number.isNaN(newIndex) ? 0 : newIndex;
      const clamped = clamp(normalized, 0, colors.misc.length);

      if (clamped === activeIndices.misc) return;
      return setActiveIndices({ ...activeIndices, misc: clamped });
    }

    const skipUpdate =
      newIndex === activeIndices[activeCategory] ||
      (newIndex !== 0 && newIndex !== 1);

    if (skipUpdate) return;
    setActiveIndices({ ...activeIndices, [activeCategory]: newIndex });
  };

  const onTabChange = (newTab: UiTab) => {
    const newCategory = newTab === "eyes" ? "leftEye" : newTab;
    setActiveCategory(newCategory);
  };

  const activeTab: UiTab =
    activeCategory === "leftEye" || activeCategory === "rightEye"
      ? "eyes"
      : activeCategory;

  return (
    <Tabs.Root<UiTab> value={activeTab} onValueChange={onTabChange}>
      <Tabs.List<UiTab>
        className="leading-none"
        aria-label="Select which part you want to customize"
      >
        <Tabs.Trigger<UiTab> value="skin" className="bg-teal-900 text-white">
          {tabIcons.skin}
        </Tabs.Trigger>
        <Tabs.Trigger<UiTab> value="hair">{tabIcons.hair}</Tabs.Trigger>
        <Tabs.Trigger<UiTab> value="eyes">{tabIcons.eyes}</Tabs.Trigger>
        {colors.misc.length > 0 && (
          <Tabs.Trigger<UiTab> value="skin">{tabIcons.misc}</Tabs.Trigger>
        )}
      </Tabs.List>

      <Tabs.Content<UiTab> value="skin" className="bg-teal-600 p-12">
        {activeCategory === "skin" && (
          <fieldset>
            <button type="button" onClick={() => onCategoryIndexChange(0)}>
              Skin 1
            </button>

            <button type="button" onClick={() => onCategoryIndexChange(1)}>
              Skin 2
            </button>

            <ColorPicker
              hexColor={colors.skin[activeIndices.skin]}
              onHexChange={onHexChange}
            />
          </fieldset>
        )}
      </Tabs.Content>

      <Tabs.Content<UiTab> value="hair">Here's some hair</Tabs.Content>

      <Tabs.Content<UiTab> value="eyes" className="bg-teal-600 p-12">
        {(activeCategory === "leftEye" || activeCategory === "rightEye") && (
          <>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("leftEye");
                onCategoryIndexChange(0);
              }}
            >
              Left eye 1
            </button>

            <br />

            <button
              type="button"
              onClick={() => {
                setActiveCategory("leftEye");
                onCategoryIndexChange(1);
              }}
            >
              Left eye 2
            </button>

            <br />

            <button
              type="button"
              onClick={() => {
                setActiveCategory("rightEye");
                onCategoryIndexChange(0);
              }}
            >
              Right eye 1
            </button>

            <br />

            <button
              type="button"
              onClick={() => {
                setActiveCategory("rightEye");
                onCategoryIndexChange(1);
              }}
            >
              Right eye 2
            </button>

            <br />

            <label>
              Link eyes?
              <input
                type="checkbox"
                checked={eyesLinked}
                onChange={toggleLink}
              />
            </label>

            <ColorPicker
              hexColor={colors[activeCategory][activeIndices[activeCategory]]}
              onHexChange={onHexChange}
            />
          </>
        )}
      </Tabs.Content>

      <Tabs.Content<UiTab> value="misc">Here's some ???</Tabs.Content>
    </Tabs.Root>
  );
}

export default function RemountOnKeyChange({
  syncKey,
  ...delegated
}: ExternalProps) {
  return <ColorMenusCore key={syncKey} {...delegated} />;
}
