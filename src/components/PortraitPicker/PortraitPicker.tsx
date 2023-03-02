import { useState } from "react";
import TabGroup from "../TabGroup";

const tabOptions = ["Etrian I", "Etrian II", "Etrian III"] as const;
type TabOption = (typeof tabOptions)[number];

export default function PortraitPicker() {
  const [selectedGame, setSelectedGame] = useState<TabOption>("Etrian I");

  return (
    <section className="flex-grow-[2]">
      <TabGroup
        options={tabOptions}
        selected={selectedGame}
        onTabChange={setSelectedGame}
      />
    </section>
  );
}
