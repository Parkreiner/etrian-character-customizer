/**
 * @todo Figure out how to get the component working with Suspense.
 */
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

import useAppState from "./useAppState";
import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import PortraitMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState } from "react";

function Main() {
  const [introAnimationFinished, setIntroAnimationFinished] = useState(false);
  const appState = useAppState();
  const characterId = appState.selectedCharacter?.id ?? "";

  return (
    <div className="font-cool mx-auto flex h-full max-w-[1400px] items-center justify-center">
      <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
        <VisuallyHidden>
          <h1>Etrian Odyssey Character Customizer</h1>
        </VisuallyHidden>

        {!introAnimationFinished && (
          <LoadingIndicator
            appLoaded={appState.initialized}
            onAnimationCompletion={() => setIntroAnimationFinished(true)}
          />
        )}

        {appState.initialized && (
          <>
            <PortraitMenus
              selectedCharacterId={characterId}
              groupedCharacters={appState.groupedCharacters}
              onCharacterChange={appState.stateUpdaters.changeCharacter}
            />

            <CharacterPreview
              selectedCharacter={appState.selectedCharacter}
              colors={appState.colors}
            />

            <ColorMenus
              characterKey={characterId}
              colors={appState.colors}
              onColorChange={appState.stateUpdaters.replaceColors}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-full w-full">
      <ErrorBoundary>
        <TooltipProvider delayDuration={500}>
          <Main />
        </TooltipProvider>
      </ErrorBoundary>
    </div>
  );
}
