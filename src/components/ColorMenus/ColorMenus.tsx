/**
 * @file Contains the top-level component view for managing colors for a
 * character.
 */
import { UiTab } from "./localTypes";
import { tabIcons } from "./localConstants";
import { CharacterColors } from "@/typesConstants/colors";
import useColorMenusState from "./useColorMenusState";

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
};

type CoreProps = Omit<ExternalProps, "characterKey">;

function ColorMenusCore({ colors, onColorChange }: CoreProps) {
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

  const selectSkinPreset = (hex1: string, hex2: string) => {
    const skipUpdate =
      hex1 === activeColorArray[0] && hex2 === activeColorArray[1];

    if (skipUpdate) {
      return;
    }

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
          selectSkinPreset={selectSkinPreset}
        >
          <div className="flex flex-row justify-center gap-x-3">
            <ColorButton
              primaryHex={colors.skin[0]}
              onClick={() => updaters.changeSelectedFill("skin", 0)}
            >
              1
            </ColorButton>

            <ColorButton
              primaryHex={colors.skin[1]}
              onClick={() => updaters.changeSelectedFill("skin", 1)}
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
      tabView: <p>Here&apos;s some hair!</p>,
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
        >
          <div className="flex flex-row justify-center gap-x-3">
            <ColorButton
              primaryHex={colors.leftEye[0]}
              onClick={() => updaters.changeSelectedFill("leftEye", 0)}
            >
              Left 1
            </ColorButton>

            <label>
              Link eyes?
              <input
                type="checkbox"
                checked={state.eyeSet1Linked}
                onChange={updaters.toggleEyeLink1}
              />
            </label>

            <ColorButton
              primaryHex={colors.rightEye[0]}
              onClick={() => updaters.changeSelectedFill("rightEye", 0)}
            >
              Right 1
            </ColorButton>
          </div>

          <div className="flex flex-row justify-center gap-x-3 ">
            <ColorButton
              primaryHex={colors.leftEye[1]}
              onClick={() => updaters.changeSelectedFill("leftEye", 1)}
            >
              Left 2
            </ColorButton>

            <label>
              Link eyes?
              <input
                type="checkbox"
                checked={state.eyeSet2Linked}
                onChange={updaters.toggleEyeLink2}
              />
            </label>

            <ColorButton
              primaryHex={colors.rightEye[1]}
              onClick={() => updaters.changeSelectedFill("rightEye", 1)}
            >
              Right 2
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
      tabView: <p>You shouldn&apos;t be able to see this yet!</p>,
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
