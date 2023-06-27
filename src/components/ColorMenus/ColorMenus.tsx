/**
 * @file Contains the top-level component view for managing colors for a
 * character.
 */
import { Fragment } from "react";
import { cva } from "class-variance-authority";
import { CharacterColors, MISC_COLOR_PRESETS } from "@/typesConstants/colors";
import { toTitleCase } from "@/utils/strings";
import {
  ColorTuple,
  HAIR_EYE_COLOR_PRESETS,
  SKIN_COLOR_PRESETS,
} from "@/typesConstants/colors";

import { UiTab, uiTabs } from "./localTypes";
import useColorMenusState from "./useColorMenusState";
import ColorButton from "./ColorButton";
import LinkToggle from "./LinkToggle";
import TabIconWrapper from "./TabIconWrapper";

import * as Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import ColorPicker from "@/components/ColorPicker";
import OverflowContainer from "../OverflowContainer/OverflowContainer";

type ExternalProps = {
  /**
   * A key for linking a character to the ColorsMenu component.
   *
   * Whenever the key changes, the entire ColorsMenu component will reset to its
   * default state, using the current character's starting colors as the
   * component's new starting colors.
   */
  characterKey: string;

  colors: CharacterColors;
  onColorChange: (newColors: CharacterColors) => void;
  onColorsReset: () => void;
};

type CoreProps = Omit<ExternalProps, "characterKey">;

// Using super bright magenta to make visual errors more obvious
const fallbackColor = "#ff00ff";

const colorPresets = {
  eyes: HAIR_EYE_COLOR_PRESETS,
  hair: HAIR_EYE_COLOR_PRESETS,
  skin: SKIN_COLOR_PRESETS,
  misc: MISC_COLOR_PRESETS,
} as const satisfies Record<UiTab, readonly ColorTuple[]>;

const tabButtonStyles = cva(
  "px-3.5 py-1 rounded-full text-sm flex flex-row flex-nowrap gap-x-1 items-center first:pl-4 last:pr-4",
  {
    variants: {
      active: {
        true: "text-opacity-100 text-teal-950 bg-teal-100 font-medium",
        false: "text-opacity-90 text-teal-50 bg-teal-800",
      } as const satisfies Record<`${boolean}`, string>,
    },
  }
);

function ColorMenusCore({ colors, onColorChange, onColorsReset }: CoreProps) {
  const { state, updaters } = useColorMenusState(colors);
  const activeColorArray = colors[state.activeCategory];
  const activeIndex = state.activeIndices[state.activeCategory];
  const activeHexColor = activeColorArray[activeIndex] ?? fallbackColor;

  // Really verbose function, but there's a lot it needs to do
  const onHexChange = (newHexColor: string) => {
    const updateBothEyes =
      state.activeTab === "eyes" && state.eyeLinkStatuses[activeIndex] === true;

    if (updateBothEyes) {
      const needUpdate =
        colors.leftEye[activeIndex] !== newHexColor &&
        colors.rightEye[activeIndex] !== newHexColor;

      if (needUpdate) {
        const updatedLeft = [...colors.leftEye];
        updatedLeft[activeIndex] = newHexColor;

        const updatedRight = [...colors.rightEye];
        updatedRight[activeIndex] = newHexColor;

        /**
         * @todo Remove nasty type casts once app has had the ColorTuple type
         * removed in favor of arbitrary-length arrays.
         */
        onColorChange({
          ...colors,

          leftEye: colors.leftEye.map((hex, index) => {
            if (index !== activeIndex) return hex;
            return newHexColor;
          }) as unknown as (typeof colors)["leftEye"],

          rightEye: colors.rightEye.map((hex, index) => {
            if (index !== activeIndex) return hex;
            return newHexColor;
          }) as unknown as (typeof colors)["rightEye"],
        });
      }

      return;
    }

    // No more linked values past here
    const skipUpdate = newHexColor === activeColorArray[activeIndex];
    if (skipUpdate) {
      return;
    }

    const newTuple = activeColorArray.map((oldHex, index) => {
      return index === activeIndex ? newHexColor : oldHex;
    });

    onColorChange({ ...colors, [state.activeCategory]: newTuple });
  };

  const selectHexPreset = (hex1: string, hex2: string) => {
    if (state.activeTab === "misc") {
      return;
    }

    if (state.activeTab === "eyes") {
      const updateAllEyes = state.eyeLinkStatuses.some((linked) => linked);
      if (updateAllEyes) {
        const newTuple = [hex1, hex2] as const;
        return onColorChange({
          ...colors,
          leftEye: newTuple,
          rightEye: newTuple,
        });
      }
    }

    const skipUpdate =
      hex1 === activeColorArray[0] && hex2 === activeColorArray[1];

    if (skipUpdate) return;
    onColorChange({
      ...colors,
      [state.activeCategory]: [hex1, hex2],
    });
  };

  return (
    <OverflowContainer.Root>
      <Tabs.Root<UiTab>
        value={state.activeTab}
        onValueChange={updaters.changeTab}
        className="flex h-full min-w-[430px] flex-col flex-nowrap self-stretch"
      >
        {/* Defines the tabs for toggling between views */}
        <OverflowContainer.Header>
          <div className="flex h-[54px] w-full flex-col flex-nowrap justify-center bg-teal-900">
            <Tabs.List<UiTab>
              aria-label="Select which part you want to customize"
              className="mx-auto flex w-fit flex-row justify-center gap-x-1 rounded-full bg-teal-800"
            >
              {uiTabs.map((tabValue) => {
                const aliasedKey =
                  tabValue === "eyes" ? state.lastEyeSelection : tabValue;

                return (
                  <Fragment key={tabValue}>
                    {colors[aliasedKey].length > 0 && (
                      <Tabs.Trigger<UiTab>
                        value={tabValue}
                        className={tabButtonStyles({
                          active: tabValue === state.activeTab,
                        })}
                      >
                        <TabIconWrapper tab={tabValue} />
                        <span>{toTitleCase(tabValue)}</span>
                      </Tabs.Trigger>
                    )}
                  </Fragment>
                );
              })}
            </Tabs.List>
          </div>
        </OverflowContainer.Header>

        <OverflowContainer.FlexContent>
          <div className="w-full pb-4">
            <button
              className="mx-auto block w-fit rounded-full bg-teal-100 px-4 py-1 text-teal-950 transition-colors hover:bg-teal-50"
              onClick={onColorsReset}
            >
              Reset all colors
            </button>
          </div>

          {/* Defines the buttons for changing active colors */}
          {uiTabs.map((tabValue) => (
            <Tabs.Content<UiTab> key={tabValue} value={tabValue}>
              <div className="mb-3">
                <Card title={`Swatches (${tabValue})`} striped>
                  {tabValue !== "eyes" && (
                    <div className="flex flex-row justify-center gap-x-3">
                      {colors[tabValue].map((color, index) => (
                        <ColorButton
                          key={index}
                          primaryHex={color}
                          selected={
                            state.activeCategory === tabValue &&
                            activeIndex === index
                          }
                          onClick={() => {
                            updaters.changeSelectedFill(tabValue, index);
                          }}
                        >
                          {index + 1}
                        </ColorButton>
                      ))}
                    </div>
                  )}

                  {tabValue === "eyes" &&
                    colors.leftEye.map((leftEyeColor, index) => {
                      const rightEyeColor = colors.rightEye[index];
                      if (rightEyeColor === undefined) return null;

                      const displayNum = index + 1;
                      return (
                        <Fragment key={index}>
                          <div className="mb-4 flex flex-row items-center justify-center gap-x-1.5">
                            <ColorButton
                              primaryHex={leftEyeColor}
                              onClick={() =>
                                updaters.changeSelectedFill("leftEye", index)
                              }
                              selected={
                                state.activeCategory === "leftEye" &&
                                activeIndex === index
                              }
                            >
                              <abbr title={`Left eye option ${displayNum}`}>
                                L{displayNum}
                              </abbr>
                            </ColorButton>

                            <LinkToggle
                              active={state.eyeLinkStatuses[index] ?? false}
                              toggleActive={() => updaters.toggleEyeLink(index)}
                              accessibleLabel={`Link L${displayNum}-R${displayNum}`}
                            />

                            <ColorButton
                              primaryHex={rightEyeColor}
                              onClick={() =>
                                updaters.changeSelectedFill("rightEye", index)
                              }
                              selected={
                                state.activeCategory === "rightEye" &&
                                activeIndex === index
                              }
                            >
                              <abbr title={`Right eye option ${displayNum}`}>
                                R{displayNum}
                              </abbr>
                            </ColorButton>
                          </div>
                        </Fragment>
                      );
                    })}
                </Card>
              </div>
            </Tabs.Content>
          ))}

          {/* Luckily, the same ColorPicker can be reused for all tabs */}
          <div className="mb-3">
            <ColorPicker hexColor={activeHexColor} onHexChange={onHexChange} />
          </div>

          {/* All the color presets associated with each tab */}
          {colorPresets[state.activeTab].length > 0 && (
            <div>
              <Card title={`Presets (${state.activeTab})`} striped={true}>
                <ul className="grid w-full max-w-[400px] grid-cols-3 justify-between gap-3">
                  {colorPresets[state.activeTab].map(([hex1, hex2], index) => (
                    <li key={index} className="mx-auto block">
                      <ColorButton
                        primaryHex={hex1}
                        secondaryHex={hex2}
                        onClick={() => selectHexPreset(hex1, hex2)}
                      />
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </OverflowContainer.FlexContent>
      </Tabs.Root>
    </OverflowContainer.Root>
  );
}

export default function ColorMenus(props: ExternalProps) {
  // All of ColorMenusCore will remount on key change; it's the fastest and
  // most fool-proof way to get the state synced up after a character changes
  return <ColorMenusCore key={props.characterKey} {...props} />;
}
