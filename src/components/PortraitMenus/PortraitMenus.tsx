import { useState } from "react";
import OverflowContainer from "../OverflowContainer";
import TabGroup from "../TabGroup";

const gameOptions = ["EO1", "EO2", "EO3"] as const;
type GameTab = (typeof gameOptions)[number];

export default function PortraitMenus() {
  const [selectedGame, setSelectedGame] = useState<GameTab>("EO1");

  return (
    <section className="flex-grow-[2]">
      <TabGroup
        options={gameOptions}
        selected={selectedGame}
        onTabChange={setSelectedGame}
      />

      <OverflowContainer>
        <div className="h-[500px]">Here are some portraits.</div>
      </OverflowContainer>
    </section>
  );
}
