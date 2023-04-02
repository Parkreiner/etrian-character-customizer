import { memo, useState } from "react";

import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
} from "@/typesConstants/gameData";
import ControlsContainer, {
  TabInfo,
  TabContentInfo,
} from "../ControlsContainer";

type CharacterButtonProps = {
  displayNumber: number;
  highlighted: boolean;
  onClick: () => void;
};

function CharacterButton({
  displayNumber,
  highlighted,
  onClick,
}: CharacterButtonProps) {
  return <button onClick={onClick}>{displayNumber}</button>;
}

type CharacterMenusProps = {
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

function CharacterMenus({
  groupedCharacters,
  selectedCharacterId,
  onCharacterChange,
}: CharacterMenusProps) {
  const [selectedGame, setSelectedGame] = useState<GameOrigin>("eo1");
  const gameGroup = groupedCharacters.get(selectedGame);

  // If there are no portraits to display by the time this component mounts, the
  // entire app is basically useless; have to treat this case as show-stopping
  if (!gameGroup) {
    throw new Error(
      `${CharacterMenus.name} - groupedCharacter prop had no value for key ${selectedGame}`
    );
  }

  const currentGameUi = Array.from(
    gameGroup,
    ([className, characters], groupIndex) => (
      <section key={groupIndex}>
        <h2>{className.toUpperCase()}</h2>

        <ol>
          {characters.map((char, charIndex) => (
            <li key={charIndex}>
              <CharacterButton
                displayNumber={charIndex + 1}
                highlighted={char.id === selectedCharacterId}
                onClick={() => onCharacterChange(char)}
              />
            </li>
          ))}
        </ol>
      </section>
    )
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
  const tabContent: TabContentInfo<GameOrigin>[] = [
    {
      value: "eo1",
      content: selectedGame === "eo1" ? currentGameUi : null,
    },
    {
      value: "eo2",
      content: selectedGame === "eo2" ? currentGameUi : null,
    },
    {
      value: "eo3",
      content: selectedGame === "eo3" ? currentGameUi : null,
    },
  ];

  return (
    <ControlsContainer<GameOrigin>
      value={selectedGame}
      onValueChange={(newGame) => setSelectedGame(newGame)}
      ariaLabel="Select a game"
      tabInfo={tabInfo}
      tabContent={tabContent}
    />
  );
}

const Memoized = memo(CharacterMenus);
export default Memoized;
