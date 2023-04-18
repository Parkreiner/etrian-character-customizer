/**
 * @todo Figure out how to get the component working with Suspense.
 */
import { useState } from "react";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

import useEditor from "./useEditor";
import CharacterPreview from "@/components/CharacterPreview";
import LoadingIndicator from "@/components/LoadingIndicator";
import PortraitMenus from "@/components/CharacterMenus";
import ColorMenus from "@/components/ColorMenus";
import ErrorBoundary from "@/components/ErrorBoundary";

function Main() {
  const [introAnimationFinished, setIntroAnimationFinished] = useState(false);
  const editor = useEditor();
  const characterId = editor.selectedCharacter?.id ?? "";

  return (
    <div className="relative h-full bg-gradient-to-br from-teal-100 to-teal-50">
      <VisuallyHidden>
        <h1>Etrian Odyssey Character Customizer</h1>
      </VisuallyHidden>

      {!introAnimationFinished && (
        <LoadingIndicator
          appLoaded={editor.initialized}
          onAnimationCompletion={() => setIntroAnimationFinished(true)}
        />
      )}

      {editor.initialized && (
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-center">
          <div className="flex max-h-[800px] flex-row items-center justify-center gap-x-10">
            <PortraitMenus
              selectedCharacterId={characterId}
              groupedCharacters={editor.groupedCharacters}
              onCharacterChange={editor.stateUpdaters.changeCharacter}
            />

            <CharacterPreview
              selectedCharacter={editor.selectedCharacter}
              colors={editor.colors}
            />

            <ColorMenus
              characterKey={characterId}
              colors={editor.colors}
              onColorChange={editor.stateUpdaters.replaceColors}
            />
          </div>
        </div>
      )}
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
