import { memo, useState } from "react";
import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
} from "@/typesConstants/gameData";

import CharacterPanel from "./CharacterPanel";
import Button from "@/components/Button";
import ControlsContainer, {
  TabInfoArray,
} from "@/components/ControlsContainer";

type Props = {
  groupedCharacters: CharsGroupedByGame;
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
  randomizeCharacter: () => void;
};

function NoCharactersDisplay() {
  return <div>No characters to display</div>;
}

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II: Heroes of Lagaard",
  eo3: "Etrian Odyssey III: The Drowned City",
} as const satisfies Record<GameOrigin, string>;

function CharacterMenus({
  groupedCharacters,
  selectedCharacterId,
  onCharacterChange,
  randomizeCharacter,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<GameOrigin>("eo1");
  const selectedGroup = groupedCharacters.get(selectedGame);

  const selectedGameContent = (
    <div className="grid w-full grid-cols-2 gap-3">
      {selectedGroup === undefined || selectedGroup.size === 0 ? (
        <NoCharactersDisplay />
      ) : (
        Array.from(selectedGroup, ([gameClass, characterList], groupIndex) => (
          <CharacterPanel
            key={groupIndex}
            gameClass={gameClass}
            characterList={characterList}
            selectedCharacterId={selectedCharacterId}
            onCharacterChange={onCharacterChange}
          />
        ))
      )}
    </div>
  );

  /**
   * Not the biggest fan of how the main content is defined for each item, but
   * there's only so much you can do when working with the API of Radix's Tabs.
   *
   * Radix handles the conditional rendering for you, but as part of that, it
   * expects you to provide it some kind of content value for each tab you add,
   * for every single render, no matter what. Doesn't matter that only one of
   * these pieces of content will be displayed at a time.
   */
  const tabInfo: TabInfoArray<GameOrigin> = [
    {
      value: "eo1",
      tabText: (
        <abbr title={nameAliases.eo1} className="no-underline">
          EO1
        </abbr>
      ),
      tabView: selectedGame === "eo1" ? selectedGameContent : null,
      accessibleTabLabel: nameAliases.eo1,
    },
    {
      value: "eo2",
      tabText: (
        <abbr title={nameAliases.eo2} className="no-underline">
          EO2
        </abbr>
      ),
      tabView: selectedGame === "eo2" ? selectedGameContent : null,
      accessibleTabLabel: nameAliases.eo2,
    },
    {
      value: "eo3",
      tabText: (
        <abbr title={nameAliases.eo3} className="no-underline">
          EO3
        </abbr>
      ),
      tabView: selectedGame === "eo3" ? selectedGameContent : null,
      accessibleTabLabel: nameAliases.eo3,
    },
  ];

  return (
    <fieldset>
      <ControlsContainer<GameOrigin>
        tabs={tabInfo}
        selectedTabValue={selectedGame}
        onTabChange={(newSelection) => setSelectedGame(newSelection)}
        tabGroupLabel="Select a game"
      />

      <div className="mx-auto mt-2 max-w-fit">
        <Button intent="secondary" size="small" onClick={randomizeCharacter}>
          Click to randomize
        </Button>
      </div>
    </fieldset>
  );
}

const Memoized = memo(CharacterMenus);
export default Memoized;
