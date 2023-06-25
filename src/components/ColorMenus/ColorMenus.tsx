/**
 * @file Contains the top-level component view for managing colors for a
 * character.
 */
import { UiTab } from "./localTypes";
import { tabIcons } from "./localConstants";
import { CharacterColors } from "@/typesConstants/colors";
import useColorMenusState from "./useColorMenusState";

import LinkToggle from "./LinkToggle";
import ColorButton from "./ColorButton";
import ControlsContainer, {
  TabInfoArray,
} from "@/components/ControlsContainer";
import MenuViewLayout from "./MenuViewLayout";

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

const fallbackColor = "#ff00ff";

function ColorMenusCore({ colors, onColorChange, onColorsReset }: CoreProps) {
  const { state, updaters } = useColorMenusState(colors);
  const activeColorArray = colors[state.activeCategory];
  const activeIndex = state.activeIndices[state.activeCategory];
  const activeHexColor = activeColorArray[activeIndex] ?? "#000000";

  // Really verbose function, but there's a lot it needs to do
  const onHexChange = (newHexColor: string) => {
    const eyesSelected =
      state.activeCategory === "leftEye" || state.activeCategory === "rightEye";

    const updateIsForSet1 =
      eyesSelected && state.eyeSet1Linked && activeIndex === 0;

    if (updateIsForSet1) {
      const needUpdate =
        newHexColor !== colors.leftEye[0] || newHexColor !== colors.rightEye[0];

      if (needUpdate) {
        onColorChange({
          ...colors,
          leftEye: [newHexColor, colors.leftEye[1]],
          rightEye: [newHexColor, colors.rightEye[1]],
        });
      }

      return;
    }

    const updateIsForSet2 =
      eyesSelected && state.eyeSet2Linked && activeIndex === 1;

    if (updateIsForSet2) {
      const needUpdate =
        newHexColor !== colors.leftEye[1] || newHexColor !== colors.rightEye[1];

      if (needUpdate) {
        onColorChange({
          ...colors,
          leftEye: [colors.leftEye[0], newHexColor],
          rightEye: [colors.rightEye[0], newHexColor],
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
      const updateBothEyes = state.eyeSet1Linked || state.eyeSet2Linked;

      if (updateBothEyes) {
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

  const tabs: TabInfoArray<UiTab> = [
    {
      value: "skin",
      tabText: "Skin",
      tabIcon: tabIcons.skin,
      tabView: (
        <MenuViewLayout
          tab="skin"
          activeHex={activeHexColor}
          onHexChange={onHexChange}
          selectHexPreset={selectHexPreset}
        >
          <div className="flex flex-row justify-center gap-x-3">
            <ColorButton
              primaryHex={colors.skin[0]}
              onClick={() => updaters.changeSelectedFill("skin", 0)}
              selected={state.activeCategory === "skin" && activeIndex === 0}
            >
              1
            </ColorButton>

            <ColorButton
              primaryHex={colors.skin[1]}
              onClick={() => updaters.changeSelectedFill("skin", 1)}
              selected={state.activeCategory === "skin" && activeIndex === 1}
            >
              2
            </ColorButton>
          </div>
        </MenuViewLayout>
      ),
    },

    {
      value: "hair",
      tabText: "Hair",
      tabIcon: tabIcons.hair,
      tabView: (
        <MenuViewLayout
          tab="hair"
          activeHex={activeHexColor}
          onHexChange={onHexChange}
          selectHexPreset={selectHexPreset}
        >
          <div className="flex flex-row justify-center gap-x-3">
            <ColorButton
              primaryHex={colors.hair[0]}
              onClick={() => updaters.changeSelectedFill("hair", 0)}
              selected={state.activeCategory === "hair" && activeIndex === 0}
            >
              1
            </ColorButton>

            <ColorButton
              primaryHex={colors.hair[1]}
              onClick={() => updaters.changeSelectedFill("hair", 1)}
              selected={state.activeCategory === "hair" && activeIndex === 1}
            >
              2
            </ColorButton>
          </div>
        </MenuViewLayout>
      ),
    },

    {
      value: "eyes",
      tabText: "Eyes",
      tabIcon: tabIcons.eyes,
      tabView: (
        <MenuViewLayout
          tab="eyes"
          activeHex={activeHexColor}
          onHexChange={onHexChange}
          selectHexPreset={selectHexPreset}
        >
          <div className="mb-4 flex flex-row items-center justify-center gap-x-1.5">
            <ColorButton
              primaryHex={colors.leftEye[0]}
              onClick={() => updaters.changeSelectedFill("leftEye", 0)}
              selected={state.activeCategory === "leftEye" && activeIndex === 0}
            >
              <abbr title="Left eye option 1">L1</abbr>
            </ColorButton>

            <LinkToggle
              active={state.eyeSet1Linked}
              toggleActive={updaters.toggleEyeLink1}
              accessibleLabel="Link L1-R1"
            />

            <ColorButton
              primaryHex={colors.rightEye[0]}
              onClick={() => updaters.changeSelectedFill("rightEye", 0)}
              selected={
                state.activeCategory === "rightEye" && activeIndex === 0
              }
            >
              <abbr title="Right eye option 1">R1</abbr>
            </ColorButton>
          </div>

          <div className="flex flex-row items-center justify-center gap-x-1.5">
            <ColorButton
              primaryHex={colors.leftEye[1]}
              onClick={() => updaters.changeSelectedFill("leftEye", 1)}
              selected={state.activeCategory === "leftEye" && activeIndex === 1}
            >
              <abbr title="Left eye option 2">L2</abbr>
            </ColorButton>

            <LinkToggle
              active={state.eyeSet2Linked}
              toggleActive={updaters.toggleEyeLink2}
              accessibleLabel="Link L2-R2"
            />

            <ColorButton
              primaryHex={colors.rightEye[1]}
              onClick={() => updaters.changeSelectedFill("rightEye", 1)}
              selected={
                state.activeCategory === "rightEye" && activeIndex === 1
              }
            >
              <abbr title="Right eye option 2">R2</abbr>
            </ColorButton>
          </div>
        </MenuViewLayout>
      ),
    },

    {
      visible: colors.misc.length > 0,
      value: "misc",
      tabText: "Misc.",
      tabIcon: tabIcons.misc,
      accessibleTabLabel: "Miscellaneous Categories",
      tabView: (
        <MenuViewLayout
          tab="misc"
          activeHex={activeHexColor}
          onHexChange={onHexChange}
          selectHexPreset={selectHexPreset}
        >
          <div className="flex flex-row justify-center gap-x-3">
            {colors.misc.map((color, index) => (
              <ColorButton
                key={color}
                primaryHex={colors.misc[index] ?? fallbackColor}
                onClick={() => updaters.changeSelectedFill("misc", index)}
                selected={
                  state.activeCategory === "misc" && activeIndex === index
                }
              >
                {index + 1}
              </ColorButton>
            ))}
          </div>
        </MenuViewLayout>
      ),
    },
  ];

  return (
    <fieldset>
      <ControlsContainer<UiTab>
        tabs={tabs}
        selectedTabValue={state.activeTab}
        onTabChange={updaters.changeTab}
        tabGroupLabel="Select which part you want to customize"
      />
    </fieldset>
  );
}

export default function ColorMenus(props: ExternalProps) {
  // All of ColorMenusCore will remount on key change; it's the fastest and
  // most fool-proof way to get the state synced up after a character changes
  return <ColorMenusCore key={props.characterKey} {...props} />;
}
