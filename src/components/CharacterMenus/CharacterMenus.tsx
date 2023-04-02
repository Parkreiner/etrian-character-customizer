import { memo, useState } from "react";
import {
  Character,
  CharsGroupedByGame,
  GameOrigin,
} from "@/typesConstants/gameData";

import CharacterButton from "./CharacterButton";
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

function CharacterMenus({
  groupedCharacters,
  selectedCharacterId,
  onCharacterChange,
}: Props) {
  const [selectedGame, setSelectedGame] = useState<GameOrigin>("eo1");
  const gameGroup = groupedCharacters.get(selectedGame);

  // If there are no portraits to display by the time this component mounts, the
  // entire app is basically useless; have to treat this case as show-stopping
  if (!gameGroup) {
    throw new Error(
      `${CharacterMenus.name} - groupedCharacter prop had no value for key ${selectedGame}`
    );
  }

  const currentGameUi = (
    <div className="grid w-full min-w-[400px] grid-cols-2 gap-3 text-white">
      {Array.from(gameGroup, (mapEntry, groupIndex) => {
        const [className, charactersList] = mapEntry;
        const classLabelName =
          className.slice(0, 1).toUpperCase() +
          className.slice(1).toLowerCase();

        return (
          <section key={groupIndex} className="rounded-md bg-teal-900 p-3">
            <h2 className="text-xs font-semibold tracking-wider text-teal-50">
              {className.toUpperCase()}
            </h2>

            <ol className="mt-2 flex w-full flex-row gap-x-2">
              {charactersList.map((char, charIndex) => (
                <li key={charIndex} className="flex-grow">
                  <CharacterButton
                    selected={char.id === selectedCharacterId}
                    displayNumber={charIndex + 1}
                    labelText={`Select ${classLabelName} ${charIndex + 1}`}
                    onClick={() => onCharacterChange(char)}
                  />
                </li>
              ))}
            </ol>
          </section>
        );
      })}
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
      onValueChange={(newSelection) => setSelectedGame(newSelection)}
      ariaLabel="Select a game"
      tabInfo={tabInfo}
      tabContent={tabContent}
    />
  );
}

const Memoized = memo(CharacterMenus);
export default Memoized;
