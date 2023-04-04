import { memo, useState } from "react";
import {
  Character,
  CharacterGroup,
  CharsGroupedByGame,
  GameOrigin,
} from "@/typesConstants/gameData";

import CharacterPanel from "./CharacterPanel";
import ControlsContainer, {
  TabInfo,
  TabContentInfo,
} from "../ControlsContainer";

type Props = {
  groupedCharacters: CharsGroupedByGame;
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
};

const tabInfo = [
  { value: "eo1", labelText: "Etrian Odyssey", content: "EO1" },
  {
    value: "eo2",
    labelText: "Etrian Odyssey II: Heroes of Lagaard",
    content: "EO2",
  },
  {
    value: "eo3",
    labelText: "Etrian Odyssey III: The Drowned City",
    content: "EO3",
  },
] as const satisfies readonly TabInfo<GameOrigin>[];

function NoCharactersDisplay() {
  return <div>No characters to display</div>;
}

function CharacterMenus({
  groupedCharacters,
  selectedCharacterId,
  onCharacterChange,
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
   * Not the biggest fan of how the content is defined for each item, but
   * there's only so much you can do when working with the API of Radix's Tabs.
   *
   * Radix handles the conditional rendering for you, but as part of that, it
   * expects you to provide it some kind of content value for each tab you add,
   * for every single render, no matter what. Doesn't matter that only one of
   * these pieces of content will be displayed at a time.
   */
  const tabContent: readonly TabContentInfo<GameOrigin>[] = [
    {
      value: "eo1",
      content: selectedGame === "eo1" ? selectedGameContent : null,
    },
    {
      value: "eo2",
      content: selectedGame === "eo2" ? selectedGameContent : null,
    },
    {
      value: "eo3",
      content: selectedGame === "eo3" ? selectedGameContent : null,
    },
  ];

  return (
    <ControlsContainer<GameOrigin>
      selectedValue={selectedGame}
      onValueChange={(newSelection) => setSelectedGame(newSelection)}
      ariaLabel="Select a game"
      tabInfo={tabInfo}
      tabContent={tabContent}
    />
  );
}

const Memoized = memo(CharacterMenus);
export default Memoized;
