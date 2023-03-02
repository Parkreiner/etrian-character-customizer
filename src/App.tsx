import ColorPicker from "./components/ColorPicker";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function App() {
  return (
    <Tooltip.Provider delayDuration={500}>
      <ColorPicker />
    </Tooltip.Provider>
  );
}
