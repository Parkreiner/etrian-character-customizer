import { useState } from "react";
import OverflowContainer from "../OverflowContainer";
import TabGroup from "../TabGroup";

const gameOptions = ["Etrian I", "Etrian II", "Etrian III"] as const;
type GameTab = (typeof gameOptions)[number];

export default function PortraitPicker() {
  const [selectedGame, setSelectedGame] = useState<GameTab>("Etrian I");

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
