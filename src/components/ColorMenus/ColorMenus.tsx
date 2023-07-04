/**
 * @file Contains the top-level component view for managing colors for a
 * character.
 */
import { Fragment } from "react";
import { CharacterColors } from "@/typesConstants/colors";

import { UiTab, uiTabs } from "./localTypes";
import useColorMenusState from "./useColorMenusState";
import ColorButton from "./ColorButton";
import LinkToggle from "./LinkToggle";
import TabButton from "./TabButton";

import * as Tabs from "@/components/Tabs";
import Card from "@/components/Card";
import ColorPicker from "@/components/ColorPicker";
import OverflowContainer from "../OverflowContainer/OverflowContainer";
import ColorPresets from "./ColorPresets";

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
          <Tabs.List<UiTab>
            aria-label="Select which part you want to customize"
            className="mx-auto flex w-fit flex-row justify-center gap-x-1 rounded-full border-2 border-teal-900 bg-teal-900"
          >
            {uiTabs.map((tabValue) => {
              const aliasedKey = tabValue === "eyes" ? "leftEye" : tabValue;
              return (
                <Fragment key={tabValue}>
                  {colors[aliasedKey].length > 0 && (
                    <TabButton
                      tabValue={tabValue}
                      active={tabValue === state.activeTab}
                    />
                  )}
                </Fragment>
              );
            })}
          </Tabs.List>
        </OverflowContainer.Header>

        <OverflowContainer.FlexContent>
          {/* Defines the buttons for changing active colors */}
          {uiTabs.map((tabValue) => (
            /**
             * By default, Radix takes each TabContent element and makes each
             * container focusable, even if you only want parts of the children
             * to have focus. Have to disable with tabIndex, but the buttons
             * inside here can still receive focus no problem
             */
            <Tabs.Content<UiTab> key={tabValue} value={tabValue} tabIndex={-1}>
              <div className="mb-3">
                <Card title={`Swatches (${tabValue})`} striped gapSize="small">
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
                          <div className="mb-4 flex flex-row items-center justify-center gap-x-1.5 first:mt-2 last:mb-1">
                            <ColorButton
                              primaryHex={leftEyeColor}
                              selected={
                                state.activeCategory === "leftEye" &&
                                activeIndex === index
                              }
                              onClick={() => {
                                updaters.changeSelectedFill("leftEye", index);
                              }}
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
                              selected={
                                state.activeCategory === "rightEye" &&
                                activeIndex === index
                              }
                              onClick={() => {
                                updaters.changeSelectedFill("rightEye", index);
                              }}
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

          <ColorPresets
            activeTab={state.activeTab}
            onHexPresetChange={selectHexPreset}
          />
        </OverflowContainer.FlexContent>

        <OverflowContainer.FooterButton onClick={onColorsReset}>
          Reset all colors
        </OverflowContainer.FooterButton>
      </Tabs.Root>
    </OverflowContainer.Root>
  );
}

export default function ColorMenus(props: ExternalProps) {
  // All of ColorMenusCore will remount on key change; it's the fastest and
  // most fool-proof way to get the state synced up after a character changes
  return <ColorMenusCore key={props.characterKey} {...props} />;
}
