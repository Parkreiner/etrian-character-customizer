import { memo, useState, useMemo } from "react";
import {
  Character,
  CharsGroupedByGame,
  ClassOrderings,
  GameOrigin,
  gameOrigins,
} from "@/typesConstants/gameData";

import CharacterPanel from "./CharacterPanel";
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

function NoCharactersDisplay() {
  return <div>No characters to display</div>;
}

const nameAliases = {
  eo1: "Etrian Odyssey",
  eo2: "Etrian Odyssey II: Heroes of Lagaard",
  eo3: "Etrian Odyssey III: The Drowned City",
} as const satisfies Record<GameOrigin, string>;

function groupCharacters(
  characters: readonly Character[],
  orderings: ClassOrderings
): CharsGroupedByGame {
  const grouped: CharsGroupedByGame = new Map(
    gameOrigins.map((game) => {
      const charOrder = orderings[game];
      const charsPerGame = new Map(
        charOrder.map((gameClass) => [gameClass, []])
      );

      return [game, charsPerGame];
    })
  );

  for (const char of characters) {
    const classArray = grouped.get(char.game)?.get(char.class);
    if (classArray !== undefined) {
      classArray.push(char);
    }
  }

  return grouped;
}

function CharacterMenus({
  selectedCharacterId,
  characters,
  classOrderings,
  onCharacterChange,
  randomizeCharacter,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<GameOrigin>("eo1");
  const groupedByGame: CharsGroupedByGame = useMemo(() => {
    if (!characters || !classOrderings) return new Map();
    return groupCharacters(characters, classOrderings);
  }, [characters, classOrderings]);

  const selectedGroup = groupedByGame.get(selectedGame);

  const selectedGameContent = (
    <div className="grid w-full grid-cols-2 gap-3">
      {characters.length === 0 || selectedGroup === undefined ? (
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

  const tabInfo: TabInfoArray<GameOrigin> = gameOrigins.map((game) => {
    return {
      value: game,
      tabText: (
        <abbr title={nameAliases[game]} className="no-underline">
          {game.toUpperCase()}
        </abbr>
      ),
      tabView: selectedGame === game ? selectedGameContent : null,
      accessibleTabLabel: nameAliases[game],
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
