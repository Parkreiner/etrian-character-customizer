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
   * I'm not the biggest fan of this pattern, but I'm kind of hamstrung by the
   * API of Radix's Tabs components. It handles the conditional rendering for
   * you, but as part of that, it expects you to provide it with versions of the
   * content UI that are NOT conditionally-calculated.
   */
  const tabContent: TabContentInfo<GameOrigin>[] = [
    {
      value: "eo1",
      content: <>{selectedGame === "eo1" && currentGameUi}</>,
    },
    {
      value: "eo2",
      content: <>{selectedGame === "eo2" && currentGameUi}</>,
    },
    {
      value: "eo3",
      content: <>{selectedGame === "eo3" && currentGameUi}</>,
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
