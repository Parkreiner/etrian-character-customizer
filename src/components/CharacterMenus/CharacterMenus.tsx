import { memo, useState } from "react";
import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
  gameOrigins,
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

  const tabInfo: TabInfoArray<GameOrigin> = gameOrigins.map((game) => {
    return {
      value: game,
      tabText: (
        <abbr title={nameAliases[game]} className="no-underline">
          {game}
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
