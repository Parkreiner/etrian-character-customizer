import { memo, useState } from "react";
import OverflowContainer from "../OverflowContainer";
import TabGroup from "../TabGroup";
import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
  gameOrigins,
} from "@/typesConstants/gameData";

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
  selectedCharacter: Character | null;
  onCharacterChange: (newCharacter: Character) => void;
};

function CharacterMenus({
  groupedCharacters,
  selectedCharacter,
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

  return (
    <section className="flex-grow-[2]">
      <TabGroup
        options={gameOrigins}
        selected={selectedGame}
        onTabChange={setSelectedGame}
      />

      <OverflowContainer>
        {Array.from(gameGroup, ([className, characters], groupIndex) => (
          <section key={groupIndex}>
            <h2>{className.toUpperCase()}</h2>

            <ol>
              {characters.map((char, charIndex) => (
                <li key={charIndex}>
                  <CharacterButton
                    displayNumber={charIndex + 1}
                    highlighted={char === selectedCharacter}
                    onClick={() => onCharacterChange(char)}
                  />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </OverflowContainer>
    </section>
  );
}

const Memoized = memo(CharacterMenus);
export default Memoized;
