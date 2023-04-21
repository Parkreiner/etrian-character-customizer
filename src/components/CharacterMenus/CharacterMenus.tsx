import { memo, useMemo, useState } from "react";
import {
  Character,
  ClassOrderings,
  GameOrigin,
  gameOrigins,
} from "@/typesConstants/gameData";

import CharacterClassPanel from "./CharacterClassPanel";
import Button from "@/components/Button";
import ControlsContainer, {
  TabInfoArray,
} from "@/components/ControlsContainer";

type Props = {
  characters: readonly Character[];
  classOrderings: ClassOrderings;
  selectedCharacterId: string;
  onCharacterChange: (newCharacter: Character) => void;
  randomizeCharacter: () => void;
};

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II: Heroes of Lagaard",
  eo3: "Etrian Odyssey III: The Drowned City",
} as const satisfies Record<GameOrigin, string>;

function CharacterMenus({
  selectedCharacterId,
  characters,
  classOrderings,
  onCharacterChange,
  randomizeCharacter,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<GameOrigin>("eo1");
  const sortedCharacters = useMemo(() => {
    return [...characters].sort((char1, char2) => {
      if (char1.id === char2.id) return 0;
      return char1.id < char2.id ? -1 : 1;
    });
  }, [characters]);

  const charsByGame = sortedCharacters.filter(
    (char) => char.game === selectedGame
  );

  const selectedGameContent = (
    <div className="grid w-full grid-cols-2 gap-3">
      {classOrderings[selectedGame].map((gameClass, index) => (
        <CharacterClassPanel
          key={index}
          gameClass={gameClass}
          selectedCharacterId={selectedCharacterId}
          onCharacterChange={onCharacterChange}
          characters={charsByGame.filter((char) => char.class === gameClass)}
        />
      ))}
    </div>
  );

  const tabInfo: TabInfoArray<GameOrigin> = gameOrigins.map((game) => {
    return {
      value: game,
      accessibleTabLabel: nameAliases[game],
      tabView: game === selectedGame ? selectedGameContent : null,
      tabText: (
        <abbr title={nameAliases[game]} className="no-underline">
          {game.toUpperCase()}
        </abbr>
      ),
    };
  });

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
